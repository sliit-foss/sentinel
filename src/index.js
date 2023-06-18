require('dotenv').config();
const axios = require('axios');
const { v5: uuidv5 } = require('uuid');
const { redis } = require('./database/redis');
const { sendMail } = require('./services');

const config = require('./config');

const pages = process.env.SENTINEL_PAGE_CONFIG ? JSON.parse(process.env.SENTINEL_PAGE_CONFIG) : require('../sentinel.json');

(async () => {
  const prefix = 'sentinel_notification:';

  const pipeline = redis.pipeline();

  const stream = redis.scanStream({
    match: `${prefix}*`,
    type: 'string',
    count: 10000,
  });

  const notified = (await new Promise((resolve) => stream.on('data', (keys) => resolve(keys)))) ?? [];

  const changes = {};

  await Promise.all(
    pages.map(async (page) => {
      const html = await axios.get(page.url).then(({ data }) => data);
      for (const content of page.content) {
        const hash = `${prefix}${uuidv5(`${page.url}-${content}`, uuidv5.URL)}`;
        if (html.includes(content)) {
          if (notified.includes(hash)) return;
          pipeline.set(hash, true);
          changes[page.name] = changes[page.name] ? [...changes[page.name], content] : [content];
        } else {
          if (!notified.includes(hash)) return;
          pipeline.del(hash);
        }
      }
    }),
  );

  if (Object.keys(changes).length) {
    await sendMail({
      to: config.NOTIFY_USER_EMAIL,
      subject: `Sentinel Notification`,
      htmlContent: `
                <h1>Page Updates</h1><hr />
                ${Object.keys(changes)
                  .map(
                    (page) => `
                    <h2>${page}</h2><ul>
                        ${changes[page].map((content) => `<li><b>${content}</b></li>`)}
                    </ul><hr />`,
                  ).join('')}
            `,
    });
  }

  await pipeline.exec();
})();

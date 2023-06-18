# sentinel

A JavaScript automation script which leverages the use of GitHub actions and notifies you of any static data changes on any given website

## Usage

1. Fork this repository

haylow

2. Configure the following repository secrets:-

    - MAIL_HOST - The SMTP host of your email provider
    - MAIL_USER - The username of your email account
    - MAIL_PASSWORD - The password of your email account
    - NOTIFY_USER_EMAIL - The email address to which the notification email should be sent
    - REDIS_CONNECTION_STRING - The connection string for a Redis database (Used to track previously notified changes)
    - SENTINEL_PAGE_CONFIG - Configuration for the pages to be monitored (See example below)

    <br/>

    ```json
    [
        {
            "name": "Example Company",
            "url": "https://www.example.org/careers",
            "content": [
                "Sofware Engineer",
                "Full Stack Engineer",
            ]
        }
    ]
    ```

    <br/>

    - The above config will notify you whenever the 2 job listings provided are added to the company's careers page

<br/>

- Note - The content of the `SENTINEL_PAGE_CONFIG` secret can also be put into a `sentinel.json` file at the root of the repository and commited to the repository. This is useful if you want to keep the configuration in version control. By default this file is ignored by git.

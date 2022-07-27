# mg-webhook-server

This server accepts a 'delivery event' webhook from Mailgun, and adds the email to a Mailchimp mailing list that you specify, and adds a tag to that user.

If the user is already in the mailing list, the server only updates the tags.

The server parses the email subject line for a particular phrase and ignores every other phrase. If you change the subject line of the email the server is looking for, this project breaks. Further revisions of this server will evaluate the intended string for a percentage of correctness.

At the moment, if the server goes down, re-tries are made on Mailgun's end. In the future, an SQS-like queuing system is ideal.

The environment variables you'll need are as follows:

PORT: a port you specify for the Express server.
MAILCHIMP_API_KEY: your Mailchimp public API key.
MAILING_LIST: the ID of the mailing list you are adding the email to.

To start this server, use the following prompt:
PORT=(port) MAILCHIMP_API_KEY=(key) MAILING_LIST=(list id) npm start
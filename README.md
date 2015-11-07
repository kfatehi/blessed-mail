# blessed-mail

This is a prototype of a new mail client.

It is a single node.js process for which the ui is the command line.

We use blessed to implement the text-based ui.
The process must have access to the local GPG command line program.
The process is launched with your Gmail credentials.
The ui allows you to browse your encrypted incoming mail.
You can decrypt those messages, compose a reply, encrypt, and send.

## Resources

[Gmail API Docs](https://developers.google.com/gmail/api/)


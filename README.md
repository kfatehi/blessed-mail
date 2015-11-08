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

## Shitty Google Caveat and TODO before we can really release

Because gmail is retarded and forces centralized power in the form of a client token, I need to make a backend so that people dont need to go creating their own client tokens and shit.

We can do this pretty easily and free using heroku. we just need to extract the relevant code from this project and put it behind a simple api and not leak the google secret.

if we leak the google api secret, all the emails of that user are compromised. although it is not ideal, this is not too bad a trade-off considering that the emails sent and received with this program are encrypted with PGP and wouldn't be affected anyway.

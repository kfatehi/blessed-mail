# blessed-mail

This is a prototype of a new Gmail client.

It uses blessed for a text-based ui.

The only keys you need to know are escape to go back, enter to drill down & decrypt, and arrow keys.

Right now it can only view emails. I'll work on sending email next weekend.

The process must be started with passphrase and key from the environment. Key making and management can also be added later thanks to dependency on the pure javascript openpgp package. In this vein, there are no dependencies other than nodejs.

## Usage

`PASSPHRASE="your passphrase goes here" KEY=$(gpg --export-secret-key -a "Your Name Here") node index.js`

## Resources

[Gmail API Docs](https://developers.google.com/gmail/api/)

## Shitty Google Caveat and TODO before we can really release

Because gmail forces centralizing power in the form of a client token, I need to make a backend so that people dont need to go creating their own client tokens and shit.

We can do this pretty easily and free using heroku. we just need to extract the relevant code from this project and put it behind a simple api and not leak the google secret.

if we leak the google api secret, all the emails of that user are compromised. although it is not ideal, this is not too bad a trade-off considering that the emails sent and received with this program are encrypted with PGP and wouldn't be affected anyway.

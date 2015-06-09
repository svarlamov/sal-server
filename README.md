# Speak and Listen
Speak and Listen is a comprehensive language assessment system that provides educators with the tools necessary to test students on their lingual knowledge. A versatile system, Speak and Listen, was initially developed to allow for simple long-distance evaluations, as is often the case with entrance and placement exams, however it is by no means limited to this use case. Speak and Listen is useful for all sorts of examinations where audio and or video are required to get the full picture of a student’s success. Previously, conducting these sorts of exams used to take hours, meeting with students in-person, or even arranging long-distance video calls, but Speak and Listen makes it as easy as creating an exam, sharing the exam, and then grading the responses whenever you have the time! Best of all, Speak and Listen requires nothing more than a camera/microphone, an internet connection, and a web browser. That’s right, no Adobe FlashPlayer, no native installations, and no other annoying software!

# System Requirements
1) *nix or OS X only. Windows support will be coming soon!
2) NodeJS
3) `npm` Installed globally ie., you can use, `npm install ______` from the terminal whilst in any directory
4) `bower` Installed globally ie., you can use, `bower install ______` from the terminal whilst in any directory
5) MongoDB

# Installing
To install the Speak and Listen server on your box you must first ensure that you meet all of the prerequisites outlined in the 'System Requirements' section. Once you are certain that the server will function on your machine, follow the next few steps to get yourself up and running.
1) Edit the MongoDB server domain in the `app.js` file to point to your MongoDB instance. This would also be the time to setup any other MongoDB settings that are specific to your installation, such as user accounts and passwords.
2) (Optional) Edit the `config.js` if you would like to use Amazon S3 file hosting to host user media.
3) (Optional) Further edit the `app.js` if you would like to change the ports, IP's, etc.
4) Open up terminal and `cd` into the installation directory, ie., `~/MyFiles/sal`
5) Execute `npm install`
6) Execute `bower install`

# Running
### In Debug
To run the Speak and Listen server in debug mode, execute the following command while in the installation directory, `DEBUG=sal:* npm start`
### In Production
Although the Speak and Listen server is not production ready yet, you may run it as such by executing the following command while in the installation directory, `npm start`
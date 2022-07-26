"use strict"
const express = require("express")
const bodyParser = require("body-parser")
const mailchimp = require('@mailchimp/mailchimp_marketing');
const crypto = require("crypto");

const app = express()
const PORT = process.env.PORT || 3000
const mailingList = process.env.MAILING_LIST || 12345678

console.log('ENVS:')
console.log('Port:',process.env.PORT)
console.log('Key:', process.env.MAILCHIMP_API_KEY)
console.log('Mailing List:', process.env.MAILING_LIST)

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: 'us18',
});

const updateMemberTags = async (emailAd) =>{
  const subscriberHash = crypto
  .createHash("md5")
  .update(emailAd.toLowerCase())
  .digest("hex");

 const response = await mailchimp.lists.updateListMemberTags(
  mailingList,
  subscriberHash,
  { tags: [{ name: "MyPA User", status: "active" }] }
);
console.log(response);
}

const addMember = async (emailAd) => {
  try{
  const response = await mailchimp.lists.addListMember(mailingList, {
    email_address: emailAd,
    status: "subscribed",
    tags:["MyPA User"]
  });
  console.log("MAILCHIMP successfully added", response.email_address, );
} catch(err) {
  console.log("MAILCHIMP Sent error:", err.response.body)
  if(err.response.body.title == "Member Exists"){
    updateMemberTags(emailAd)
  }
}
};

app.use(bodyParser.json())
app.get("/", (req, res) => {
  res.status(200).end()
})
app.post("/", (req, res) => {
  let message = req.body['event-data'].message
  console.log('MAILGUN: bad address - ', message)
  res.status(200).end()
})
app.post("/hook", (req, res) => {

  let emailAd = req.body['event-data'].message.headers.to
  let subject = req.body['event-data'].message.headers.subject


  if(subject == 'Welcome to My Piano Adventures!'){
    console.log('MAILGUN: success for', emailAd)
    addMember(emailAd)
    res.status(200).end()
  }else{
    console.log('MAILGUN: other notification - ', subject)
    res.status(200).end()
  }
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

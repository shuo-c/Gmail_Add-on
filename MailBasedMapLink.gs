/**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessage(e) {
  console.log(e);
  // Get the ID of the message the user has open.
  var messageId = e.gmail.messageId;

  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the subject of the email.
  var message = GmailApp.getMessageById(messageId);
  return
}

/**
 * Callback for rendering the card for the compose action dialog.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailCompose(e) {
  console.log(e);
  var header = CardService.newCardHeader()
      .setTitle('Insert Map Link')
  var input1 = CardService.newTextInput()
      .setFieldName('text1')
      .setTitle('Location')
  var input2 = CardService.newTextInput()
      .setFieldName('text2')
      .setTitle('longitude and latitude')
  var action = CardService.newAction()
      .setFunctionName('onGmailInsertLink');
  var button = CardService.newTextButton()
      .setText('Insert map link')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);
  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(input1)
      .addWidget(input2)
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);
  return card.build();
}

/**
 * Callback for inserting a map link into the Gmail draft.
 * @param {Object} e The event object.
 * @return {CardService.UpdateDraftActionResponse} The draft update response.
 */
function onGmailInsertLink(e) {
  console.log(e);
  // Get the text that was entered by the user.
  var text1 = e.formInput.text1;
  var text2 = e.formInput.text2;
  // parameter to act as a cache buster.
  // test1 for address
  // test2 for the coordinate
  if (!text1) {return}
  var LinkContent = ""
  if (text2) {
    LinkContent += Utilities.formatString('<a href="https://www.google.com/maps?q=%s">%s</a>', encodeURIComponent(text2), encodeURIComponent(text1));
  }
  else {LinkContent = text1;}
  var response = CardService.newUpdateDraftActionResponseBuilder()
      .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
          .addUpdateContent(LinkContent,CardService.ContentType.MUTABLE_HTML)
          .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT))
      .build();
  return response;
}

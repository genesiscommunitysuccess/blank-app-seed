[Review Guidance](https://www.notion.so/genesisglobal/Platform-Code-Review-Process-ace93ba760cc4563b0dfb712e2a88d8a)

📓 &nbsp; **Related JIRA**



[PTC-0](https://genesisglobal.atlassian.net/browse/PTC-0)



🤔 &nbsp; **What does this PR do?**



- Add bullets..



🚀 &nbsp; **Where should the reviewer start?**



Add file / directory pointers.



📑 &nbsp; **How should this be tested?**

### Defaults


```
rm -rf blankappseedtest && npx -y @genesislcap/genx@latest init blankappseedtest -x --ref YOUR-BRANCH-NAME --no-npm
```

### Route and CSV parameter handling test

```
rm -rf blankappseedtest && npx -y @genesislcap/genx@latest init blankappseedtest --ref YOUR-BRANCH-NAME --no-npm -x --routes '[{"name":"Home","tiles":[{"title":"Entity manager","type":"entity-manager","config":{ "modalPosition": "centre", "sizeColumnsToFit": true, "enableSearchBar": true, "resourceName":"ALL_POSITIONS","title":"My Positions","updateEvent":"EVENT_COUNTERPARTY_MODIFY","deleteEvent":"EVENT_COUNTERPARTY_DELETE","createEvent":"EVENT_COUNTERPARTY_INSERT", "createFormUiSchema": {"type":"VerticalLayout","elements":[{"type":"Control","label":"Inline create schema - main contact","scope":"#/properties/MAIN_CONTACT"},{"type":"Control","label":"Issuer Name - Local Schema","scope":"#/properties/ISSUER_NAME","options":{"readonly":true}},{"type":"Control","label":"Price","scope":"#/properties/PRICE"},{"type":"Control","scope":"#/properties/COUNTERPARTY","options":{"allOptionsResourceName":"ALL_COUNTERPARTYS","valueField":"COUNTERPARTY_ID","labelField":"COUNTERPARTY_ID"}},{"type":"Control","label":"Password","scope":"#/properties/PASSWORD","options":{"isPassword":true}},{"type":"Control","label":"Password","scope":"#/properties/PASSWORD","options":{"textarea":true}}]}, "updateFormUiSchema": {"type":"VerticalLayout","elements":[{"type":"Control","label":"Inline update schema - main contact","scope":"#/properties/MAIN_CONTACT"},{"type":"Control","label":"Issuer Name - Local Schema","scope":"#/properties/ISSUER_NAME","options":{"readonly":true}},{"type":"Control","label":"Price","scope":"#/properties/PRICE"},{"type":"Control","scope":"#/properties/COUNTERPARTY","options":{"allOptionsResourceName":"ALL_COUNTERPARTYS","valueField":"COUNTERPARTY_ID","labelField":"COUNTERPARTY_ID"}},{"type":"Control","label":"Password","scope":"#/properties/PASSWORD","options":{"isPassword":true}},{"type":"Control","label":"Password","scope":"#/properties/PASSWORD","options":{"textarea":true}}]}, "columns": [{"field":"INSTRUMENT_NAME","headerName":"Instrument Name"},{"field":"VALUE","headerName":"Inline coldef - VALUE"},{"field":"QUANTITY","headerName":"Quantity"},{"field":"PNL","headerName":"PNL"}] }},{"title":"Grid","type":"grid-pro","config":{"resourceName":"ALL_TRADES", "deferredGridOptions": {"columnDefs":[{"field":"INSTRUMENT_NAME","headerName":"Instrument Name"},{"field":"VALUE","headerName":"Inline coldef - VALUE"},{"field":"QUANTITY","headerName":"Quantity"},{"field":"PNL","headerName":"PNL"}]} }},{"title":"Form","type":"smart-form","config":{"resourceName":"EVENT_COUNTERPARTY_INSERT", "uischema": {"type":"VerticalLayout","elements":[{"type":"Control","label":"Inline form schema - main contact","scope":"#/properties/MAIN_CONTACT"},{"type":"Control","label":"Issuer Name - Local Schema","scope":"#/properties/ISSUER_NAME","options":{"readonly":true}},{"type":"Control","label":"Price","scope":"#/properties/PRICE"},{"type":"Control","scope":"#/properties/COUNTERPARTY","options":{"allOptionsResourceName":"ALL_COUNTERPARTYS","valueField":"COUNTERPARTY_ID","labelField":"COUNTERPARTY_ID"}},{"type":"Control","label":"Password","scope":"#/properties/PASSWORD","options":{"isPassword":true}},{"type":"Control","label":"Password","scope":"#/properties/PASSWORD","options":{"textarea":true}}]} }}]}, {"name":"Realtime Dashboard","tiles":[{"title":"Entity manager tile","type":"entity-manager","config":{"resourceName":"ALL_COUNTERPARTYS","title":"Counterparty Management","updateEvent":"EVENT_COUNTERPARTY_MODIFY","deleteEvent":"EVENT_COUNTERPARTY_DELETE","createEvent":"EVENT_COUNTERPARTY_INSERT"}},{"title":"Form tile","type":"smart-form","config":{"resourceName":"EVENT_COUNTERPARTY_INSERT"}}]},{"name":"Analytics","tiles":[{"title":"Grid Tile","type":"grid-pro","config":{"resourceName":"ALL_POSITIONS"}},{"title":"Charts Tile 1","type":"chart","config":{"type":"line","resourceName":"ALL_POSITIONS","xField":"INSTRUMENT_NAME","yField":"VALUE"}},{"title":"Charts Tile 2","type":"chart","config":{"type":"pie","resourceName":"ALL_POSITIONS","xField":"INSTRUMENT_NAME","yField":"VALUE"}},{"title":"Charts Tile 3","type":"chart","config":{"type":"column","resourceName":"ALL_POSITIONS","xField":"INSTRUMENT_ID","yField":"VALUE"}}]}]' --csv '[{"name": "trade", "fields": ["a", "B"]}, {"name": "position", "fields": ["id", "TYPE"]} ]' --apiHost 'wss://public-foundation.genesislab.global/gwf/' --no-shell && cd blankappseedtest/client && npm run bootstrap && npm run dev
```

✅ &nbsp; **Checklist**



<!--- Review the list and put an x in the boxes that apply. -->


- [ ] I have tested my changes.
- [ ] I have added tests for my changes.
- [ ] I have updated the project documentation to reflect my changes.

import iconv from 'iconv-lite';
import AdmZip from 'adm-zip';
import fetch from 'node-fetch';
import xml2js from 'xml2js';

(async () => {

  const res = await fetch('http://www.cbr.ru/s/newbik');
  const buffer = new Buffer.from(await res.arrayBuffer()) 

  const zip = new AdmZip(buffer);
  let xml = zip.getEntries();
  xml = iconv.decode(xml[0].getData(), 'win1251')

  const parser = new xml2js.Parser();
  let jObj = await parser.parseStringPromise(xml);
  jObj = jObj.ED807.BICDirectoryEntry;

  const result = [];

  for (let elem of jObj) {
    if (!elem.Accounts) continue;
    for (let acc of elem.Accounts) {
      result.push({
        bic: elem.$.BIC,
        name:  elem.ParticipantInfo[0].$.NameP,
        corrAccount: acc.$.Account
      })
    }
  }

  // return result;
  console.log(result)

})()

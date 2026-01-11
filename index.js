const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Charger le schéma Protobuf
const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

// Données
const employees = [
  { id: 1, name: 'Ali', salary: 9000 },
  { id: 2, name: 'Kamal', salary: 22000 },
  { id: 3, name: 'Amal', salary: 23000 }
];

const jsonObject = { employee: employees };

// JSON
console.time('JSON encode');
const jsonData = JSON.stringify(jsonObject);
console.timeEnd('JSON encode');

console.time('JSON decode');
JSON.parse(jsonData);
console.timeEnd('JSON decode');

fs.writeFileSync('data.json', jsonData);

// XML
const xmlOptions = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};

console.time('XML encode');
const xmlData =
  '<root>' +
  convert.json2xml(jsonObject, xmlOptions) +
  '</root>';
console.timeEnd('XML encode');

console.time('XML decode');
const xmlToJson = convert.xml2json(xmlData, { compact: true });
JSON.parse(xmlToJson);
console.timeEnd('XML decode');

fs.writeFileSync('data.xml', xmlData);

// Protobuf
const errMsg = EmployeeList.verify(jsonObject);
if (errMsg) throw Error(errMsg);

console.time('Protobuf encode');
const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();
console.timeEnd('Protobuf encode');

console.time('Protobuf decode');
EmployeeList.decode(buffer);
console.timeEnd('Protobuf decode');

fs.writeFileSync('data.proto', buffer);

// Taille des fichiers
const jsonSize = fs.statSync('data.json').size;
const xmlSize = fs.statSync('data.xml').size;
const protoSize = fs.statSync('data.proto').size;

console.log('\n📦 Taille des fichiers :');
console.log(`JSON     : ${jsonSize} octets`);
console.log(`XML      : ${xmlSize} octets`);
console.log(`Protobuf : ${protoSize} octets`);

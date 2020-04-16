const fs = require('fs');
const path = require('path');
const { csvParse } = require('d3-dsv');

const source = path.resolve(__dirname, '../public/data/area-data.csv');
const destination = path.resolve(__dirname, '../public/data/area-data.json');

const buildData = () => {
  const rawData = fs.readFileSync(source, (err, data) => {
    if (err) {
      console.error('Could not run buildData function for some reason...');
      console.error(err);
    }
    return data;
  });
  const theData = csvParse(rawData.toString(), row => {
    let count = 1;
    let initial = [];
    let continued = [];
    const keys = Object.keys(row);
    while (true) {
      if (!keys.includes(`initial${count}`)) {
        break;
      }
      initial.push(+row[`initial${count}`]);
      continued.push(+row[`continued${count}`]);
      count++;
    }
    return {
      id: +row[keys[0]], //I don't know why row.id doesn't work here, but it doesn't...
      abbr: row.abbr,
      name: row.name,
      grInitialAvg: +row.grInitialAvg,
      grInitialMax: +row.grInitialMax,
      grContinuedAvg: +row.grContinuedAvg,
      grContinuedMax: +row.grContinuedMax,
      i: initial,
      c: continued,
    };
  });
  return theData;
};

const writeData = () => {
  const data = buildData();
  console.log('Writing new data to file...');
  fs.writeFileSync(destination, JSON.stringify(data, null, 0));
  console.log('New data created.');
};

fs.access(destination, err => {
  console.log('Deleting old data...');
  if (err) {
    console.log('No data file found, creating from scratch.');
    writeData();
  } else {
    fs.unlink(destination, err => {
      if (err) throw err;
      console.log('Old data deleted.');
      writeData();
    });
  }
});

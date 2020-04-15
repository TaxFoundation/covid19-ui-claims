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
    let weeks = [];
    let count = 1;
    const keys = Object.keys(row);
    while (true) {
      if (!keys.includes(`initial${count}`)) {
        break;
      }
      weeks.push({
        w: +count,
        i: +row[`initial${count}`],
        c: +row[`continued${count}`],
      });
      count++;
    }
    return {
      id: +row[keys[0]], //I don't know why row.id doesn't work here, but it doesn't...
      abbr: row.abbr,
      name: row.name,
      grAvg: +row.greatrecessionavg,
      grMax: +row.greatrecessionmax,
      weeks,
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

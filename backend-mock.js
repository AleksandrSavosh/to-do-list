const faker = require('faker');
const _ = require('lodash');

const performers = _.times(10, i => ({
  id: i,
  name: faker.name.findName()
}));

module.exports = () => ({
  performers,
  tasks: _.times(3, i => ({
    id: i,
    description: faker.lorem.sentences(),
    priority: Math.round(Math.random() * 9),
    performerId: performers[Math.floor(Math.random() * performers.length)].id,
    created: faker.date.past(),
    isCompleted: faker.datatype.boolean
  }))
});

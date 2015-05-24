import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, link;
module('mirage:integration:schema:belongsTo instantiating with params', {
  beforeEach: function() {
    var db = new Db();
    db.loadData({
      users: [],
      addresses: [
        {id: 1, name: 'Link'}
      ]
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);

    link = schema.user.find(1);
  }
});

test('the parent accepts a saved childs id', function(assert) {
  var address = schema.address.new({user_id: 1});

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

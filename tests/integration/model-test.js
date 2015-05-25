import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var definePlainAttribute, schema;
module('mirage:model#init', {
  beforeEach: function() {
    var db = new Db();
    db.createCollection('users');

    schema = new Schema(db);

    var Kingdom = Model.extend();
    var User = Model.extend({
      kingdom: Mirage.belongsTo()
    });

    schema.register('kingdom', Kingdom);
    schema.register('user', User);

    definePlainAttribute = sinon.spy(Model.prototype, "definePlainAttribute");
  },

  afterEach: function() {
    definePlainAttribute.restore();
  }
});

test('it calls #definePlainAttribute for passed-in plain attrs', function(assert) {
  schema.kingdom.new({name: 'Hyrule'});

  assert.equal(definePlainAttribute.callCount, 1);
  assert.ok(definePlainAttribute.withArgs('name').calledOnce);
});

test('it calls #definePlainAttribute for passed-in plain attrs, but not foreign keys', function(assert) {
  schema.user.new({name: 'Link', age: '100'});

  assert.equal(definePlainAttribute.callCount, 2);
  assert.ok(definePlainAttribute.withArgs('name').calledOnce);
  assert.ok(definePlainAttribute.withArgs('age').calledOnce);
});

test('it doesnt call #definePlainAttribute for foreign keys, even if one is passed in', function(assert) {
  schema.user.new({name: 'Link', kingdom_id: 1});

  assert.equal(definePlainAttribute.callCount, 1);
  assert.ok(definePlainAttribute.withArgs('name').calledOnce);
});

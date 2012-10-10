/*
 * sObjectRecord Specification
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 */

describe('sObjectRecord.js', function() {

  beforeEach(function() {
    subject = new sObjectRecord();
    subject.set('Name', 'Contact');
    subject.set('FirstName', 'John');
    subject.set('LastName', 'Smith');
  });

  describe('.is()', function() {
    it('returns the internal value of from the is object', function() {
      expect(subject.is('saved')).toEqual(false);
    })
  });

  describe('._isNow()', function() {
    it('sets the value of the key in the is object to true', function() {
      subject._isNow('something');
      expect(subject.is('something')).toEqual(true);
    })
  });

  describe('._isNoLonger()', function() {
    it('sets the value of the key in the is object to true', function() {
      subject._isNoLonger('something');
      expect(subject.is('something')).toEqual(false);
    })
  });

  describe('.get()', function() {

    describe('single values', function() {

      it('returns the value of the attribute if it is defined', function() {
        expect(subject.get('FirstName')).toEqual('John');
      });

      it('returns undefined if the attribute is not defined', function() {
        expect(subject.get('MiddleName')).toBeUndefined();
      });

    });

    describe('multiple value', function() {

      it('returns an object with the keys and their values', function() {
        expect(subject.get('FirstName', 'LastName')).toEqual({
          FirstName: 'John',
          LastName: 'Smith'
        });
      });

    });

  });

  describe('.set()', function() {

    describe('single values', function() {

      it('adds the key and value to the set of pending attributes', function() {
        subject.set('FirstName', 'Jack');
        expect(subject.get('FirstName')).toEqual('Jack');
      });

    })

    describe('multiple values', function() {

      it('adds keys and values to the set of pending attributes', function() {
        subject.set({
          'FirstName': 'Jack',
          'LastName': 'Galilee'
        });
        expect(subject.get('FirstName')).toEqual('Jack');
        expect(subject.get('LastName')).toEqual('Galilee');
      });

    });

  });

  describe('.save()', function() {

    describe('record does have an id', function() {

    });

    describe('record does not have an id', function() {

    });

  });

  describe('.reload()', function() {

    describe('record does have an id', function() {

    });

    describe('record does not have an id', function() {

      it('throws an exception', function() {
        expect(subject.reload()).
          toThrow(new Error("Unable to reload non-persisted sObject record."));
      })

    });

  });

  describe('.toJSON()', function() {

    it('converts the attributes of the object into a JSON object', function() {
      expect(subject.toJSON()).toEqual({
        Name: 'Contact',
        FirstName: 'John',
        LastName: 'Smith'
      })
    });

  });

  describe('.toString()', function() {

    it('converts the attributes of the object into a string', function() {
      expect(subject.toString()).
        toEqual('{"Name":"Contact","FirstName":"John","LastName":"Smith"}');
    });

  });

});

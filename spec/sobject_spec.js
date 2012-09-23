describe('sobject.js', function() {

  beforeEach(function() {
    subject = new sObject();
    subject.set('Name', 'Contact')
    subject.savePendingAttributes();
  })

  describe('.find()', function() {

    it('creates a query selecting the set of fields from the class', function() {
      subject.set('Name', 'Contact')
      expect(subject.
        find(['Id', 'FirstName', 'LastName']).
        finish()).
      toEqual("SELECT Id, FirstName, LastName FROM Contact")
    });

    it('creates a query selecting the set of fields from the class with a where condition', function() {
      subject.set('Name', 'Contact')
      expect(subject.
        find(['Id', 'FirstName', 'LastName']).
        where('FirstName').equal('Jack').
        finish()).
      toEqual("SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Jack")
    });

    it('creates a query selecting the set of fields from the class with a where condition and a limit', function() {
      subject.set('Name', 'Contact')
      expect(subject.
        find(['Id', 'FirstName', 'LastName']).
        where('FirstName').isNotNull().
        limit(10).
        finish()).
      toEqual("SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IS NOT NULL LIMIT 10")
    });

  })

  describe('.get()', function() {
    it('returns the value of the attribute if it is defined', function() {
      expect(subject.get('Name')).toEqual('Contact');
    })

    it('returns undefined if the attribute is not defined', function() {
      expect(subject.get('Eman')).toBeUndefined()
    })
  })

  describe('.set()', function() {
    it('adds the key and value to the set of pending attributes', function() {
      subject.set('FirstName', 'Jack')
      expect(subject.get('FirstName')).toNotEqual('Jack');
      subject.savePendingAttributes();
      expect(subject.get('FirstName')).toEqual('Jack');
    });

    it('adds the keys and values to the set of pending attributes', function() {
      subject.set({
        'FirstName': 'Jack',
        'LastName': 'Galilee'
      })
      expect(subject.get('FirstName')).toNotEqual('Jack');
      expect(subject.get('LastName')).toNotEqual('Galilee');
      subject.savePendingAttributes();
      expect(subject.get('FirstName')).toEqual('Jack');
      expect(subject.get('LastName')).toEqual('Galilee');
    })
  });

});
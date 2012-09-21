describe('QueryBuilder', function() {

  subject = new QueryBuilder();

  describe('.find([0..n])', function() {

    it('creates a find query with no columns', function() {
      expect(subject.
        find([]).
        finish()).
      toEqual('SELECT');
    });

    it('creates a find query with one column, without a seperator', function() {
      expect(subject.
        find(['Name']).
        finish()).
      toEqual('SELECT Name');
    });

    it('creates a find query with two columns, with a comma seperator', function() {
      expect(subject.
        find(['Id', 'Name']).
        finish()).
      toEqual('SELECT Id, Name');
    });

  });

  describe('.from(name)', function() {

    it('creates a find query taken from a specified table', function() {
      expect(subject.
        find(['Id', 'Name']).
        from('Contact').
        finish()).
      toEqual('SELECT Id, Name FROM Contact');
    });

  });

  describe('.where(field)', function() {

    describe('.equals(value)', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').equal('Joe').
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Joe');
      });

      describe('.and(value)', function() {

        it('creates a find query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            find(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').equal('Joe').
            and('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Joe AND LastName == Bloggs');
        });

      });

      describe('.or(value)', function() {

        it('creates a find query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            find(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').equal('Joe').
            or('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName == Joe OR LastName == Bloggs');
        });

      });

    });

    describe('.notEqual(value)', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').notEqual('Joe').
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName != Joe');
      });

      describe('.and(value)', function() {

        it('creates a find query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            find(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').notEqual('Joe').
            and('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName != Joe AND LastName == Bloggs');
        });

      });

      describe('.or(value)', function() {

        it('creates a find query taken from a specified table, with multiple conditions on multiple columns', function() {
          expect(subject.
            find(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').notEqual('Joe').
            or('LastName').equal('Bloggs').
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName != Joe OR LastName == Bloggs');
        });

      });

    });

    describe('.isNull()', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').isNull().
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IS NULL');
      });

    });

    describe('.isNotNull()', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').isNotNull().
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IS NOT NULL');
      });

    });

    describe('.in([0..n])', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').in(['Joe', 'John']).
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John )');
      });

    });

    describe('.limit(n)', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').in(['Joe', 'John']).
          limit(10).
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) LIMIT 10');
      });

    });

    describe('.orderBy([0..n])', function() {

      it('creates a find query taken from a specified table, with a single condition on a column', function() {
        expect(subject.
          find(['Id', 'FirstName', 'LastName']).
          from('Contact').
          where('FirstName').in(['Joe', 'John']).
          orderBy(['FirstName', 'LastName']).
          limit(10).
          finish()).
        toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) ORDER BY FirstName, LastName LIMIT 10');
      });

      describe('.orderByAsc([0..n])', function() {

        it('creates a find query taken from a specified table, with a single condition on a column', function() {
          expect(subject.
            find(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').in(['Joe', 'John']).
            orderByAsc(['FirstName', 'LastName']).
            limit(10).
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) ORDER BY ASC FirstName, LastName LIMIT 10');
        });

      });

      describe('.orderByDesc([0..n])', function() {

        it('creates a find query taken from a specified table, with a single condition on a column', function() {
          expect(subject.
            find(['Id', 'FirstName', 'LastName']).
            from('Contact').
            where('FirstName').in(['Joe', 'John']).
            orderByDesc(['FirstName', 'LastName']).
            limit(10).
            finish()).
          toEqual('SELECT Id, FirstName, LastName FROM Contact WHERE FirstName IN( Joe, John ) ORDER BY DESC FirstName, LastName LIMIT 10');
        });

      });

    });

  });

});

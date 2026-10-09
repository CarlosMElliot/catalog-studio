"""Exercise the production reservation/downgrade SQL against SQLite."""
import re, sqlite3, tempfile, threading
from pathlib import Path
root=Path(__file__).resolve().parent.parent
upload=(root/'app/api/media/route.ts').read_text()
reserve=re.search(r'db.prepare\("(INSERT OR IGNORE INTO media.*?)"\)',upload).group(1)
admin=(root/'app/api/admin/accounts/route.ts').read_text()
downgrade=re.search(r"db.prepare\('(UPDATE accounts SET name=.*?)'\)",admin).group(1)
with tempfile.TemporaryDirectory() as d:
 path=d+'/db.sqlite'
 db=sqlite3.connect(path)
 for m in sorted((root/'drizzle').glob('*.sql')): db.executescript(m.read_text())
 db.execute("INSERT INTO accounts (id,email,name,user_id,plan,status,quota_bytes,is_owner,created_at) VALUES('a','a@example.com','A',NULL,'starter','active',100,0,'now')")
 db.execute("INSERT INTO accounts (id,email,name,user_id,plan,status,quota_bytes,is_owner,created_at) VALUES('b','b@example.com','B',NULL,'starter','active',100,0,'now')")
 db.commit()
 def put(id,n,account='a'):
  with sqlite3.connect(path,timeout=10) as c:
   return c.execute(reserve,(id,account,n,'image/jpeg','image','now',account,account,n)).rowcount
 results=[]
 def attempt(i): results.append(put('concurrent'+str(i),60))
 threads=[threading.Thread(target=attempt,args=(i,)) for i in range(2)]
 for t in threads:t.start()
 for t in threads:t.join()
 assert sorted(results)==[0,1],results
 assert put('exact',40)==1
 assert put('overflow',1)==0
 assert put('other',100,'b')==1
 assert put('exact',40)==0
 assert db.execute(downgrade,('A','essential','active',99,None,'a','a',99)).rowcount==0
 assert db.execute(downgrade,('A','essential','active',100,None,'a','a',100)).rowcount==1
 assert db.execute(downgrade,('A','custom','active',100,24999,'a','a',100)).rowcount==1
 assert db.execute("SELECT plan,quota_bytes,monthly_price_cents FROM accounts WHERE id='a'").fetchone()==('custom',100,24999)
 db.execute("UPDATE accounts SET status='suspended',quota_bytes=1000 WHERE id='a'");db.commit()
 assert put('suspended',1)==0
 assert db.execute('SELECT SUM(bytes) FROM media WHERE account_id=?',('a',)).fetchone()[0]==100
 print('PASS: concurrent reservation, exact limit, overflow, tenant isolation, duplicate, downgrade and suspension')

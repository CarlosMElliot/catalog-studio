import fitz,xlrd,json,re,os,collections
from PIL import Image
base='/workspace/scratch/e9c07a36f188/upload/'
doc=fitz.open(base+'NOVA TRADING USA CORP CATALOG (1).pdf');products=[]
for pi,page in enumerate(doc):
 if pi==0:continue
 blocks=page.get_text('blocks'); category=blocks[0][4].strip().split('\n')[0]; category='Philippines' if category=='Philppines' else category
 for b in blocks:
  sku=b[4].strip()
  if not re.fullmatch(r'\d{7}',sku):continue
  col=round((b[0]-52)/139);row=round((b[1]-170)/161.4);x=30+col*138.75;y=82+row*161.4
  cell=[z for z in blocks if z[0]>=x-1 and z[0]<x+137 and z[1]>=y-1 and z[1]<y+150]
  bi=blocks.index(b)
  name=' '.join(blocks[bi-1][4].split())
  lower=blocks[bi+1][4].strip()
  m=re.search(r'(\d+(?:\.\d+)?/[A-Za-z0-9./() -]+)\s*$',lower)
  pack=m.group(1).strip() if m else ''
  desc=' '.join((lower[:m.start()] if m else lower).split())
  barcode=''.join(re.sub(r'\D','',z[4]) for z in cell if z[0]>x+105 and z[1]<b[1])
  imgs=[a for a in page.get_image_info() if x<=a['bbox'][0]<x+105 and y<=a['bbox'][1]<y+150]
  image=''
  if imgs:
   rect=fitz.Rect(imgs[0]['bbox']);page.get_pixmap(matrix=fitz.Matrix(2,2),clip=rect).save('public/products/'+sku+'.png');Image.open('public/products/'+sku+'.png').convert('RGB').save('public/products/'+sku+'.jpg',quality=89,optimize=True);os.remove('public/products/'+sku+'.png');image='/products/'+sku+'.jpg'
  products.append(dict(id='pdf-'+sku,sku=sku,name=name,category=category,description=desc,pack=pack,upc=barcode,image=image,price='',stock='',brand='',tags='',active=True,sourcePage=pi+1))
doc[0].get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(doc[0].get_image_info()[0]['bbox'])).save('public/nova-logo.png')
w=xlrd.open_workbook(base+'stdrptProductsPrint (2).xls');s=w.sheet_by_index(0);excel=[]
for ri in range(3,s.nrows):
 r=s.row_values(ri)
 if not r[0] or not r[1]:continue
 excel.append(dict(id='xls-'+str(ri),sku=str(r[0]),name=str(r[1]),brand=str(r[2]),upc=str(r[3]),price=r[4],category=str(r[5]),pack=str(r[10]),stock=r[12],description=str(r[16]),active=str(r[17]).upper()=='Y',image='',tags=''))
json.dump(products,open('public/pdf-products.json','w'),ensure_ascii=False)
json.dump(excel,open('public/excel-products.json','w'),ensure_ascii=False)
print('PDF',len(products),'unique',len(set(p['sku'] for p in products)),'images',sum(bool(p['image']) for p in products),'missing names',sum(not p['name'] for p in products),'Excel',len(excel));print(products[:2]);print(collections.Counter(p['category'] for p in products))

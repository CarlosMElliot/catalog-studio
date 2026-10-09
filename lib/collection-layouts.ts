export const collectionLayouts=[
 {id:'seasonal-fashion',name:'Seasonal Fashion',count:4,description:'Fashion · Four airy panels with strong seasonal headings.',paper:'#fffaf7',ink:'#292323',accent:'#b52632'},
 {id:'bold-fashion',name:'Bold Fashion',count:2,description:'Fashion · Two large image-and-story panels with red accents.',paper:'#fff',ink:'#171717',accent:'#ce2534'},
 {id:'warm-lookbook',name:'Warm Lookbook',count:2,description:'Fashion · Warm terracotta panels with generous photo space.',paper:'#f6eee3',ink:'#47342a',accent:'#a55139'},
 {id:'minimal-collection',name:'Minimal Collection',count:4,description:'Fashion · Restrained neutral cards and plenty of white space.',paper:'#faf9f6',ink:'#34332f',accent:'#8c8172'},
 {id:'bridal-elegance',name:'Bridal Elegance',count:1,description:'Fashion · One full-length product story on ivory paper.',paper:'#fbf8f1',ink:'#554b40',accent:'#a18b70'},
 {id:'menswear-edit',name:'Menswear Edit',count:9,description:'Fashion · A clean nine-item line sheet for apparel and accessories.',paper:'#fff',ink:'#252525',accent:'#555'},
 {id:'aqua-skincare',name:'Aqua Skincare',count:4,description:'Beauty · Four fresh aqua panels for skincare collections.',paper:'#effafd',ink:'#234653',accent:'#2488a4'},
 {id:'beauty-editorial',name:'Beauty Editorial',count:2,description:'Beauty · Two spacious photo-and-description stories.',paper:'#fff',ink:'#24272b',accent:'#147e8a'},
 {id:'care-collection',name:'Care Collection',count:3,description:'Beauty · Three wide panels in soft cream and rose.',paper:'#fbf4ef',ink:'#56483e',accent:'#a77272'}
] as const;
export const collectionLayout=(id?:string)=>collectionLayouts.find(l=>l.id===id);

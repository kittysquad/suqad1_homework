  // ScrapBoard, Row, Item
export class ScrapBoard extends Object {};
export class ScrapRow extends Object {};
export class ScrapItem extends Object {};

var scrapboard_data = new ScrapBoard();
scrapboard_data.id = '1';
scrapboard_data.title = 'First ScrapBoard';


var scraprow_data = [];
(function(){
  let row;
  for( var i = 0 ; i < 3 ; ++ i ){
    row = new ScrapRow();
    row.id = `${i}`;
    row.title = `${i} row title`;
    scraprow_data.push( row );
  }
})();
export function getScrapRow( id ){
  return scraprow_data.find( row => row.id === id );
};
export function getScrapRows(){
  return scraprow_data;
};

var scrapitem_data = [];
( function(){
    let item;
    for( var i = 0 ; i < 3 ; ++ i ){
      for( var j = 0 ; j < 5 ; ++ j ){
        item = new ScrapItem();
        item.id = `${i}${j}`;
        item.row_id = `${i}`;
        item.title = "scrap item " + i + " " + j;
        item.ck_cnt = 0;
        scrapitem_data.push( item );
      }
    }
})();

export function getScrapItem( id ){
  return scrapitem_data.find( item => item.id === id );
}
export function getScrapItems( row_id ){  
  let ret = scrapitem_data.filter( item => item.row_id === row_id );
  return ret;
}
export function incItemClickcnt( id ){
  let ret = scrapitem_data.find( item => item.id === id );
  ret.ck_cnt ++;
  return ret;
}

export function getScrapBoard(id){
  return scrapboard_data;
}
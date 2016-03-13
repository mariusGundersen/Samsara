import {appendSuffix} from 'nth';

export default function nth(n){
  try{
    return appendSuffix(n);
  }catch(e){
    return 'no';
  }
}

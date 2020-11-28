export function  truncatParagraphe(_text: string){

    const nbr_lettres = 400 ;

    if (_text.length > nbr_lettres) {

      return (_text.substring(0, nbr_lettres) + '...');

     } else {

       return _text + '.';
    }

  }

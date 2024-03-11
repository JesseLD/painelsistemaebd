export function addPlanDays(dataString:string,days:number) {
  var data = new Date(dataString);
  data.setDate(data.getDate() + days);
  
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona +1 porque os meses em JavaScript vão de 0 a 11
  var ano = data.getFullYear();
  var hora = data.getHours().toString().padStart(2, '0');
  var minuto = data.getMinutes().toString().padStart(2, '0');
  var segundo = data.getSeconds().toString().padStart(2, '0');
  var milissegundo = data.getMilliseconds().toString().padStart(3, '0');
  
  return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}.${milissegundo}`;
}
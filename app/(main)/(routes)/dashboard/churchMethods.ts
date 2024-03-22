
class ChurchMethods {

  async updateChurchPlan(id: number, plan: number) {
    const response = await fetch(`/api/app/church/update?id=${id}&plan=${plan}`);
    return response.json();



    
  }

}



export const churchMethods = new ChurchMethods();
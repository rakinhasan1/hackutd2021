
export interface Point {
  flowPerDay: number,
  dollarsPerDay: number,
}
interface WaterOperation {
  name: string,
  id: string,
  revenueStructure: Point[],
}

export interface ServerRequest {
  flowRateIn: number;
  operations: WaterOperation[];
  type: "CURRENT_STATE";
};

export interface ServerResponse {
  incrementalRevenue: number,
  revenuePerDay: number,
  flowRateIn: number,
  flowRateToOperations: number,
  type: "OPTIMATION_RESULT",
  currentPitVolume?: number ,
  maximumPitVolume?: number ,
}

export interface Equation {
    operationVariable: number,
    slope: number,
    yIntercept: number,
    domain: number,
}

export type ClientResponse = {
  operationId: string,
  flowRate: number,
}[];


/*export function recursiveAlgorithm(n: number, domain: number, equations: Equation[], results: { flowRates: number[], totalRevenue: number }, request: ServerRequest) {
    if (n == request.operations.length - 1) {
        // test again 
        let min_domain = 0;
        let max_domain = 0;
        min_domain += domain;
        max_domain += min_domain + 50000;
        if (min_domain <= request.flowRateIn && request.flowRateIn <= max_domain) {
            //add the total flow equation when building matrix
            /*let matrix: number[][] = new Array<Array<number>>();
            for (let i = 0; i < request.operations.length * 2; i++) {
                for (let j = 0; j < request.operations.length; j++) {

                }
            }
            for (let i = 0; i < equations.length; i++) {
                matrix[equations[i].operationVariable][equations[i].operationVariable] = -equations[i].slope;//flow rate variable for each operation
                matrix[equations[i].operationVariable][equations[i].operationVariable * 2] = 1;//revenue variable for each operation
                matrix[equations[i].operationVariable][request.operations.length*2 - 1] = equations[i].yIntercept;//
            }

            //calculate best totalRevenue by solving system of equations
            //return new flowRates if it is highest totalRevenue or old if worse
            let reven
            for (let i = 0; i < equations.length; i++) {
                for (let j = equations[i].domain; j <= equations[i].domain + 10000; j += 1000) {
                    let revenue = equations[i].slope * j + equations[i].yIntercept;
                }
            }
        }
        return results;
    }
    let newResults: { flowRates: number[], totalRevenue: number } = { flowRates: [], totalRevenue: 0 };
    if (n < request.operations.length) {
        //for (let i = n; i < request.operations.length; i++) {
            for (let j = 0; j < request.operations[n].revenueStructure.length-1; j++) { //loops through all equations in an operation
                // test whether it is possible to form a solution with these selections
                let min_domain = 0;
                let max_domain = 0;
                min_domain += domain + request.operations[n].revenueStructure[j].flowPerDay;
                max_domain += min_domain + 50000;
                if (min_domain <= request.flowRateIn && request.flowRateIn <= max_domain) {
                    // get the equation of this operations section
                    const y1 = request.operations[n].revenueStructure[j].dollarsPerDay;
                    const y2 = request.operations[n].revenueStructure[j + 1].dollarsPerDay;
                    const x1 = request.operations[n].revenueStructure[j].flowPerDay;
                    const x2 = request.operations[n].revenueStructure[j + 1].flowPerDay;
                    const slope = (y2 - y1) / (x2 - x1);
                    const yIntercept = y1 - slope * x1;
                    let equation: Equation = { slope: slope, yIntercept: yIntercept, operationVariable: n } as Equation;
                    equation.slope = slope;
                    equation.yIntercept = yIntercept;
                    equation.operationVariable = n;
                    equation.domain = request.operations[n].revenueStructure[j].flowPerDay;
                    //add the equation to our system
                    equations.push(equation);
                    //go into the next operation with our current system and current best revenue
                    newResults = recursiveAlgorithm(n + 1, min_domain, equations, newResults, request);
                }
            }
        //}
    }
    return results;
}*/

let maxRevenue = 0;
let maxPoints: number[] = [];
let operationChosenPoints: number[] = [];
export function recurse(operationNumber: number, flowUsage: number, currentRevenue: number, request: ServerRequest): any {
    const totalFlow = Math.round(request.flowRateIn / 10000) * 10000;
    console.log(totalFlow);
    if (operationNumber == request.operations.length - 1) {
        for (let i = 0; i < request.operations[operationNumber].revenueStructure.length; i++) {
            if (flowUsage + request.operations[operationNumber].revenueStructure[i].flowPerDay <= totalFlow) {
                operationChosenPoints.push(i);
                console.log(operationChosenPoints.length);
                if (maxRevenue >= currentRevenue + request.operations[operationNumber].revenueStructure[i].dollarsPerDay) {
                    return maxRevenue;
                } else {
                    maxPoints = operationChosenPoints;
                    maxRevenue = currentRevenue + request.operations[operationNumber].revenueStructure[i].dollarsPerDay;
                    return maxRevenue;
                }
            } else {
                operationChosenPoints.push(0);
                if (maxRevenue >= currentRevenue) {
                    return maxRevenue;
                } else {
                    maxPoints = operationChosenPoints;
                    maxRevenue = currentRevenue;
                    return maxRevenue;
                }
            }
        }
    } else {
        for (let i = 0; i < request.operations[operationNumber].revenueStructure.length; i++) {
            if (flowUsage + request.operations[operationNumber].revenueStructure[i].flowPerDay <= totalFlow) {
                if (operationChosenPoints[i] != null) {
                    delete operationChosenPoints[i];
                }
                operationChosenPoints.push(i);
                console.log(operationChosenPoints.length);
                console.log(request.operations.length);

                recurse(operationNumber + 1, flowUsage + request.operations[operationNumber].revenueStructure[i].flowPerDay, currentRevenue + request.operations[operationNumber].revenueStructure[i].dollarsPerDay, request);
            } else {
                for (let j = operationChosenPoints.length; j < request.operations.length; j++) {
                    operationChosenPoints.push(0);
                }
                if (maxRevenue >= currentRevenue) {
                    return maxRevenue;
                } else {
                    maxPoints = operationChosenPoints;
                    maxRevenue = currentRevenue;
                    return maxRevenue;
                }
            }
        }
    }
}
let minLoss = 10000000;
let leastLostOperations: number[] = [];
let flowLoss: number[] = [];

export function fixSum(indexs: number[], maxPoints: Point[], excessLoss: number, request: ServerRequest) {
    let excessFlow = 0;
    for (let i = 0; i < maxPoints.length; i++) {
        excessFlow += maxPoints[i].flowPerDay;
        console.log(excessFlow);
    }
    excessFlow = request.flowRateIn - excessFlow;
    console.log(excessFlow);
    for (let i = 0; i < request.operations.length; i++) {
        let indexModifier = Math.round(excessFlow / 10000);
        console.log(indexModifier);
        let newIndex = indexs[i] + indexModifier;
        if (newIndex < request.operations[i].revenueStructure.length - 1 && newIndex >= 0) {
            let loss = request.operations[i].revenueStructure[indexs[i]].dollarsPerDay - request.operations[i].revenueStructure[indexs[i] + indexModifier].dollarsPerDay;
            if (minLoss > loss) {
                minLoss = loss;
                leastLostOperations.push(i);
                flowLoss.push(excessFlow);
                indexs[i] = newIndex;
            }
        } else {
            let loss: number;
            if (newIndex > 19) {
                loss = request.operations[i].revenueStructure[indexs[i]].dollarsPerDay - request.operations[i].revenueStructure[19].dollarsPerDay + excessLoss;
                if (minLoss > loss) {
                    minLoss = loss;
                    leastLostOperations.push(i);
                    flowLoss.push((19 - indexs[i]) * 10000);
                    indexs[i] = 19;
                }
            } else {
                loss = request.operations[i].revenueStructure[indexs[i]].dollarsPerDay - request.operations[i].revenueStructure[0].dollarsPerDay + excessLoss;
                if (minLoss > loss) {
                    minLoss = loss;
                    leastLostOperations.push(i);
                    flowLoss.push(indexs[i] * 10000);
                    indexs[i] = 0;
                }
            }
            fixSum(indexs, maxPoints, excessLoss + loss, request);
        }
    }
}



export function processRequest(request: ServerRequest): ClientResponse {
    const totalFlow = Math.round(request.flowRateIn / 10000) * 10000;
    const evenDistribution = request.flowRateIn / request.operations.length;

  /*let matrix: number[][];
  let addedEquations: Equation[];
  let totalSlope = 0;
  let totalYIntercept = 0;
  for (let i = 0; i < request.operations[0].revenueStructure.length - 1; i++) {
      for (let j = 0; j < request.operations.length; j++) {
          const y1 = request.operations[i].revenueStructure[j].dollarsPerDay;
          const y2 = request.operations[i].revenueStructure[j + 1].dollarsPerDay;
          const x1 = request.operations[i].revenueStructure[j].flowPerDay;
          const x2 = request.operations[i].revenueStructure[j + 1].flowPerDay;
          const slope = (y2 - y1) / (x2 - x1);
          const yIntercept = y1 - slope * x1;
          matrix[j][j] = -slope;
          matrix[j][request.operations.length - 2] = 1;
          matrix[j][request.operations.length - 1] = yIntercept;
      }
      //matrix[]
  }*/
  /*const totalFlow = Math.round(request.flowRateIn / 10000)*10000;
  let revenue = 0;
  for (let i = 0; i < request.operations.length; i++) {
      for (let j = 0; j < request.operations[i].revenueStructure.length; j++) {
          for (let k = i+1; k < request.operations.length; k++) {
              for (let l = 0; l < request.operations[k].revenueStructure.length; l++) {
                  
              }
          }
      }
  }*/
  //const results: { flowRates: number[], totalRevenue: number } = recursiveAlgorithm(0, 0, [], { flowRates: [], totalRevenue: 0 }, request);
  //const results: { totalRevenue: number, flowRates: number[] } = recurse(0, 0, 0, request);
  let maxRevenue: number = 0;
  let maxPoints: Point[] = new Array<Point>();
  let indexs: number[] = new Array<number>();
  for (let i = 0; i < request.operations.length; i++) {
      for (let j = 0; j < request.operations[i].revenueStructure.length; j++) {
          if (maxRevenue < request.operations[i].revenueStructure[j].dollarsPerDay) {
              maxRevenue = request.operations[i].revenueStructure[j].dollarsPerDay;

              maxPoints[i] = { flowPerDay: request.operations[i].revenueStructure[j].flowPerDay, dollarsPerDay: request.operations[i].revenueStructure[j].dollarsPerDay };
              indexs[i] = j;
          }
      }
      maxRevenue = 0;
  }
  let excessFlow = 0;
  for (let i = 0; i < maxPoints.length; i++) {
      excessFlow += maxPoints[i].flowPerDay;
      console.log(excessFlow);
  }
  excessFlow = (request.flowRateIn - excessFlow);
  console.log(excessFlow);
  /*let minLoss = 10000000;
  let leastLostOperation = 0;
  for (let i = 0; i < request.operations.length; i++) {
      let indexModifier = Math.round(excessFlow / 10000);
      console.log(indexModifier);
      let newIndex = indexs[i] + indexModifier;
      if (newIndex < request.operations[i].revenueStructure.length - 1 && newIndex >= 0) {
          let loss = request.operations[i].revenueStructure[indexs[i]].dollarsPerDay - request.operations[i].revenueStructure[indexs[i] + indexModifier].dollarsPerDay;
          if (minLoss > loss) {
              minLoss = loss;
              leastLostOperation = i;
          }
      } else {
          
      }
  }*/
  //fixSum(indexs, maxPoints, 0, request);
  let excessFlowDistribution = excessFlow / request.operations.length;
  let flowRates: number[] = new Array<number>();
  for (let i = 0; i < request.operations.length; i++) {
      flowRates[i] = maxPoints[i].flowPerDay;
      //for (let j = 0; j < leastLostOperations.length; j++) {
        //  if (leastLostOperations[j] == i) {
          //    flowRates[i] += flowLoss[j];
         // }
      //}
  }
  return request.operations.map((operation,i) => {
    return {
        operationId: operation.id,
        flowRate: flowRates[i] + excessFlowDistribution-10,
      }
  })
}
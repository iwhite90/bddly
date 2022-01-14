export interface Step {
  stepType: string;
  description: string;
  param: string;
}

export interface Report {
  title: string;
  data: string;
}

export interface InterestingGiven {
  title: string;
  data: any;
}

export interface SpecInfo {
  testName: string;
  interestingGivens: InterestingGiven[];
  reportLog: Report[];
  testFailed: boolean;
  steps: Step[];
}

export interface Node {
  name: string;
  children: Node[];
}

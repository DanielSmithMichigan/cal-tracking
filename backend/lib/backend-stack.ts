import * as cdk from '@aws-cdk/core';
import * as tracking_stack from './tracking-stack';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new tracking_stack.TrackingStack(this, 'TrackingStack');
  }
}

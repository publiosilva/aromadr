import { ASTNodeModel, FunctionOrMethodInvocationModel } from '../../domain/models';
import { FindAllFunctionOrMethodInvocations, GetLiteralValue } from '../../domain/usecases';


export class FindAllFunctionOrMethodInvocationsService implements FindAllFunctionOrMethodInvocations {
  constructor(
    private readonly getLiteralValue: GetLiteralValue
  ) { }

  execute(node: ASTNodeModel): FunctionOrMethodInvocationModel[] {
    const invocations: FunctionOrMethodInvocationModel[] = [];

    const callNode = node.children.find(({ type }) => type === 'call');

    if (callNode) {
      invocations.push(this.extractCallData(callNode));
    }

    const callExpressionChildren = node.children.filter(({ children }) => {
      return children.find((c) => c.type === 'call_expression');
    });

    callExpressionChildren.forEach((callExpressionChild) => {
      if (callExpressionChild) {
        const callExpression = this.extractCallExpressionData(callExpressionChild);

        if (callExpression) {
          invocations.push(callExpression);
        }
      }
    });

    const methodInvocationChildren = node.children.filter(({ type, children }) => {
      return type === 'expression_statement' && children.find((c) => c.type === 'method_invocation');
    });

    methodInvocationChildren.forEach((methodInvocationChild) => {
      if (methodInvocationChild) {
        const methodInvocation = this.extractMethodInvocationData(methodInvocationChild);

        if (methodInvocation) {
          invocations.push(methodInvocation);
        }
      }
    });

    const invocationExpressionChildren = node.children.filter(({ type, children }) => {
      return type === 'expression_statement' && children.find((c) => c.type === 'invocation_expression');
    });

    invocationExpressionChildren.forEach((invocationExpressionChild) => {
      if (invocationExpressionChild) {
        const invocationExpression = this.extractInvocationExpressionData(invocationExpressionChild);

        if (invocationExpression) {
          invocations.push(invocationExpression);
        }
      }
    });

    const childrenInvocations: FunctionOrMethodInvocationModel[] = node.children.reduce((prev: FunctionOrMethodInvocationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)];
    }, []);

    return [...invocations, ...childrenInvocations];
  }

  private extractInvocationExpressionData(node: ASTNodeModel): FunctionOrMethodInvocationModel {
    const invocationExpressionNode = node.children.find(({ type }) => type === 'invocation_expression');
    const memberExpressionNode = invocationExpressionNode!.children.find((c) => c.type === 'member_access_expression');
    const identifier = memberExpressionNode
      ? this.getLiteralValue.execute(memberExpressionNode)
      : invocationExpressionNode!.children.filter(({ type }) => type === 'identifier').at(-1)?.value || '';
    const parameterListNode = invocationExpressionNode!.children.find(({ type }) => type === 'argument_list');
    const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

    return {
      identifier,
      node,
      parameterListNode,
      parameterNodes,
    };
  }

  private extractCallData(node: ASTNodeModel): FunctionOrMethodInvocationModel {
    const callIdentifier = node?.children.filter(({ type }) => ['identifier', '.'].includes(type)).map(({ value }) => value).join('') || '';

    if (callIdentifier) {
      const parameterListNode = node.children.find(({ type }) => type === 'argument_list');
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier: callIdentifier, node, parameterListNode, parameterNodes };
    } else {
      const attributeNode = node.children.find(({ type }) => type === 'attribute');
      const identifier = attributeNode ? this.getLiteralValue.execute(attributeNode) : '';
      const parameterListNode = node.children.find(({ type }) => type === 'argument_list');
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier, node, parameterListNode, parameterNodes };
    }
  }

  private extractCallExpressionData(
    node: ASTNodeModel,
    identifierQueue: string[] = [],
    parameterListNodesQueue: (ASTNodeModel | undefined)[] = []
  ): FunctionOrMethodInvocationModel {
    const callExpressionNode = node.type === 'call_expression' ? node : node.children.find(({ type }) => type === 'call_expression');
    const memberExpressionNode = callExpressionNode!.children.find((c) => c.type === 'member_expression');

    if (memberExpressionNode) {
      identifierQueue.push(memberExpressionNode.children.find(({ type }) => type === 'property_identifier')?.value || '');
      parameterListNodesQueue.push(callExpressionNode!.children.find(({ type }) => type === 'arguments'));

      const chainedCallExpressionNode = memberExpressionNode.children.find(({ type }) => type === 'call_expression');
      const chained = chainedCallExpressionNode ? this.extractCallExpressionData(chainedCallExpressionNode, identifierQueue, parameterListNodesQueue) : undefined;

      const identifier = chained ? identifierQueue.shift() || '' : this.getLiteralValue.execute(memberExpressionNode);
      const parameterListNode = parameterListNodesQueue.shift();
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { chained, identifier, node, parameterListNode, parameterNodes };
    } else {
      identifierQueue.push(callExpressionNode!.children.find(({ type }) => type === 'identifier')?.value || '');
      parameterListNodesQueue.push(callExpressionNode!.children.find(({ type }) => type === 'arguments'));

      const identifier = identifierQueue.shift() || '';
      const parameterListNode = parameterListNodesQueue.shift();
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier, node, parameterListNode, parameterNodes };
    }
  }

  private extractMethodInvocationData(node: ASTNodeModel): FunctionOrMethodInvocationModel | undefined {
    const methodInvocationNode = node.children.find(({ type }) => type === 'method_invocation');
    const identifiersNodes = methodInvocationNode!.children.filter(({ type }) => ['identifier', '.'].includes(type));
    const parameterListNode = methodInvocationNode!.children.find(({ type }) => type === 'argument_list');
    const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));
    const identifier = identifiersNodes?.map(({ value }) => value).join('');

    return identifier ? { identifier, node, parameterListNode, parameterNodes } : undefined;
  }
}

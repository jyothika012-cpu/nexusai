import type { Node, Edge } from '@xyflow/react';
export type NodeKind='webhook'|'schedule'|'ai'|'condition'|'slack'|'sheets'|'http';
export type FlowData={label:string;kind:NodeKind;description?:string;config:Record<string,unknown>};
export type Workflow={id:string;ownerId:string;name:string;description:string;status:'draft'|'active'|'paused';nodes:Node<FlowData>[];edges:Edge[];createdAt?:unknown;updatedAt?:unknown;webhookSecret?:string};
export type Execution={id:string;workflowId:string;workflowName:string;ownerId:string;status:'running'|'success'|'failed';startedAt?:{toDate:()=>Date};finishedAt?:{toDate:()=>Date};durationMs?:number;error?:string;steps?:Array<{nodeId:string;label:string;status:string;durationMs:number;output?:unknown;error?:string}>};

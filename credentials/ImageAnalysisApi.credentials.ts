import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ImageAnalysisApi implements ICredentialType {
	documentationUrl = "https://azure.microsoft.com/en-us/products/ai-services/openai-service";
	name = 'imageAnalysisApi';
	displayName = 'ImageAnalysis API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'key',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Instance',
			name: 'instance',
			type: 'string',
			default: "",
			required: true,
		},
		{
			displayName: 'Deployment',
			name: 'deployment',
			type: 'string',
			default: "",
			required: true,
		},
		{
			displayName: 'Version',
			name: 'version',
			type: 'string',
			default: "",
			required: true,
		},
	];
}
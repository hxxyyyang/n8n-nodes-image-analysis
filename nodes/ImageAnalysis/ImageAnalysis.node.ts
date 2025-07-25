import { IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { AzureChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

export class ImageAnalysis implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AI识图',
		icon: 'file:azure.svg',
		name: 'imageAnalysis',
		group: ['transform'],
		version: 1,
		description: '利用Azure OpenAI进行图片分析、打标',
		defaults: {
			name: 'AI识图',
		},
		properties: [
			{
				displayName: 'Text Input',
				name: 'prompt',
				type: 'string',
				default: "What's in this image?",
				required: true,
				placeholder: "",
				typeOptions: {
					rows: 10,
				},
			},
			{
				displayName: 'URL(s)',
				name: 'images',
				type: 'string',
				default: "",
				required: true,
				placeholder: "e.g. https://example.com/image.jpg",
				description: "URL(s) of the image(s) to analyze, multiple URLs can be added separated by comma",
			}
		],
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'azureOpenAIApi',
				required: true,
			}
		],
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const prompt = this.getNodeParameter('prompt', 0) as string
		const images = this.getNodeParameter('images', 0) as string

		const clientConfig = await this.getCredentials('azureOpenAIApi') as AzureChatOpenAIConfig

		let response: any
		try {
			const content = await analyzeImage(clientConfig, prompt, images)
			response = { content }
		} catch (err) {
			response = { error: String(err) }
		}

		return [this.helpers.returnJsonArray([{
			json: response
		}])]
	}
}

export interface AzureChatOpenAIConfig {
	azureOpenAIApiKey: string
	azureOpenAIApiDeploymentName: string
	azureOpenAIApiInstanceName: string
	azureOpenAIApiVersion: string
}

async function analyzeImage(config: AzureChatOpenAIConfig, prompt: string, images: string) {
	const client = new AzureChatOpenAI(config)
	const imageUrls = images.split(',').map((image) => ({
		type: 'image_url',
		image_url: {
			url: image
		}
	}))

	const content = [{
		type: 'text',
		text: prompt,
	}, ...imageUrls]

	const humanMessage = new HumanMessage({ content })

	const response = await client.invoke([humanMessage])
	return response.content as string
}

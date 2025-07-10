import { AzureChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

export interface ImageAnalysisClientConfig {
	key: string
	deployment: string
	instance: string
	version: string
}

export class ImageAnalysisClient {
	private client: AzureChatOpenAI

	constructor(config: ImageAnalysisClientConfig) {
		this.client = new AzureChatOpenAI({
			azureOpenAIApiKey: config.key,
			azureOpenAIApiDeploymentName: config.deployment,
			azureOpenAIApiInstanceName: config.instance,
			azureOpenAIApiVersion: config.version,
		})
	}

	async analyzeImage(prompt: string, images: string) {
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

		const response = await this.client.invoke([humanMessage])
		return response.content as string
	}
}

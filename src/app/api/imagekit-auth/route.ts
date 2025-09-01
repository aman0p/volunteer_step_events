import config from "@/lib/config"
import { getUploadAuthParams } from "@imagekit/next/server"
import { getCorsHeaders, corsOptionsResponse } from "@/lib/utils"

const {
    env: {
        imagekit: { publicKey, privateKey, urlEndpoint }
    }
} = config

export async function GET() {
    try {
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: privateKey,
            publicKey: publicKey,
        })

        return Response.json({
            token,
            expire,
            signature,
            publicKey: publicKey
        }, {
            headers: getCorsHeaders()
        })
    } catch (error) {
        return Response.json({
            error: "Authentication for Imagekit failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { 
            status: 500,
            headers: getCorsHeaders()
        })
    }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
    return corsOptionsResponse()
}
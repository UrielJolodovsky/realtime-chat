import { fetchRedis } from "@/app/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import {z} from "zod"

export async function POST (req: Request) {
    try {
        const body = await req.json()

        const {email: emailToAdd} = addFriendValidator.parse(body.email)

        const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`, {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            cache: "no-store",
        })

        const data = await RESTResponse.json() as {result: string | null}
        const isToAdd = data.result
        const session = await getServerSession(authOptions)
        
        if (!session) {
            return new Response("Unauthorized", {status: 401})
        }
        if (isToAdd === session.user.id) {
            return new Response("You can't add yourself as a friend", {status: 400})
        }
        if (!isToAdd) {
            return new Response("User not found", {status: 400})
        }

        console.log(data)
        // check if user is already added

        const isAlreadyAdded = await fetchRedis('sismember', `user:${isToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1

        if (isAlreadyAdded) {
            return new Response("You have already added this user", {status: 400})
        }

        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, isToAdd) as 0 | 1

        if (isAlreadyFriends) {
            return new Response("You are already friends", {status: 400})
        }
        
        // valid request, send friends request
        db.sadd(`user:${isToAdd}:incoming_friend_requests`, session.user.id)

        return new Response("Friend request sent", {status: 200})

    } catch (error) {
        if (error instanceof z.ZodError){
            return new Response('Invalid request payload', {status: 422})
        }
        return new Response('Invalid request', {status: 400})
    }
}
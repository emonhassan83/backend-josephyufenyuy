import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

export type TExpiresIn =
  | number
  | '30s'
  | '1m'
  | '5m'
  | '10m'
  | '1h'
  | '1d'
  | '7d'
  | '30d'
  | '365d'

export const createToken = (
  jwtPayload: { _id: Types.ObjectId; email: string; role: string },
  secret: string,
  expiresIn: TExpiresIn,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn })
}

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as jwt.JwtPayload
}

// export const authNotifyAdmin = async (
//   action: 'PASSWORD_CHANGE' | 'PASSWORD_FORGET' | 'PASSWORD_RESET',
// ) => {
//   const admin = await findAdmin()

//   // Determine the message and description based on the action
//   let message
//   let description

//   switch (action) {
//     case 'PASSWORD_CHANGE':
//       message = messages.adminProfile.passwordChanged
//       description = 'Admin has successfully changed their password.'
//       break
//     case 'PASSWORD_FORGET':
//       message = messages.adminProfile.passwordForgot
//       description =
//         'A password reset request has been initiated for the admin account.'
//       break
//     case 'PASSWORD_RESET':
//       message = messages.adminProfile.passwordReset
//       description = 'The admin has successfully reset their password.'
//       break
//     default:
//       throw new Error('Invalid action type')
//   }

//   // Create a notification entry
//   await NotificationService.createNotificationIntoDB({
//     receiver: admin?._id,
//     message,
//     description,
//     model_type: modeType.Auth,
//   })
// }

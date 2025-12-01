import Payment from '../payment/payment.models'
import { Service } from '../service/service.model'
import { PAYMENT_STATUS } from '../serviceBooking/serviceBooking.constant'
import { ServiceBooking } from '../serviceBooking/serviceBooking.model'
import { USER_ROLE } from '../user/user.constant'
import { User } from '../user/user.model'

const getAdminDashboardMetaData = async () => {
  const totalUsers = await User.countDocuments({
     role: { $ne: USER_ROLE.admin },
    isDeleted: false,
  })
  const totalService = await Service.countDocuments({ isDeleted: false })
  const totalBooking = await ServiceBooking.countDocuments()

   const totalRevenueData = await Payment.aggregate([
    {
      $match: {
        isPaid: true,
        isDeleted: false,
        status: PAYMENT_STATUS.paid,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const totalRevenue = totalRevenueData?.[0]?.totalAmount || 0;

  // 1. Get 4 latest active services
  const services = await Service.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(4)
    .select('title subtitle images')

  return {
    totalUsers,
    totalService,
    totalBooking,
    totalRevenue,
    services,
  }
}

export const MetaService = {
  getAdminDashboardMetaData,
}

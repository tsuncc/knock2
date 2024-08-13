//正式時不進版本控制，依操作電腦狀況決定內容
export const API_SERVER = 'http://localhost:3001'
//↑後端的ip port

// users
export const JWT_LOGIN_POST = `${API_SERVER}/users/login-jwt`
export const VERIFY_OTP_POST = `${API_SERVER}/users/verify-otp`
export const VERIFY_TOKEN_POST = `${API_SERVER}/users/verify-token`
export const GOOGLE_LOGIN_POST = `${API_SERVER}/users/google-login`
export const REGISTER_POST = `${API_SERVER}/users/register`
export const OTP_MAIL_POST = `${API_SERVER}/users/otp-mail`
export const VERIFY_OTP_MAIL_POST = `${API_SERVER}/users/verify-otp-mail`
export const RESET_PASSWORD_POST = `${API_SERVER}/users/reset-password`
export const GOOGLE_AUTHENTICATOR_SETUP_POST = `${API_SERVER}/users/2fa/request`
export const GOOGLE_AUTHENTICATOR_VERIFY_POST = `${API_SERVER}/users/2fa/verify-otp`
export const GOOGLE_AUTHENTICATOR_UNSET_POST = `${API_SERVER}/users/2fa/unset2fa`

// notifications
export const NOTIFICATION_CENTER_GET = `${API_SERVER}/notifications/notification_center`
export const PREVIOUS_NOTIFICATION_POST = `${API_SERVER}/notifications/previous_notification`
export const SEND_ALL_POST = `${API_SERVER}/notifications/send-all`
export const SEND_PERSONAL_POST = `${API_SERVER}/notifications/send-personal`
export const MARK_MESSAGE_READ_POST = `${API_SERVER}/notifications/mark_message_read`


// product image path
export const PRODUCT_IMG = `${API_SERVER}/images`
export const PRODUCT_LIST = `${API_SERVER}/products`
export const PRODUCT_BACKEND_IMG = `${API_SERVER}/products/img`
export const PRODUCT_DETAILS = `${API_SERVER}/products/details`
export const PRODUCT_FAVORITE = `${API_SERVER}/products/favorite`

// order & checkout
export const ORDER_LIST_GET = `${API_SERVER}/orders/list`
export const ORDER_DETAILS_GET = `${API_SERVER}/orders`
export const CANCEL_ORDER = `${API_SERVER}/orders/api/cancel_order`
export const ORDER_REVIEW_POST = `${API_SERVER}/orders/api/add-reviews`
export const ORDER_REVIEW_GET = `${API_SERVER}/orders/api/reviews`
export const CART_POST = `${API_SERVER}/checkout/api/cart_member`
export const CHECKOUT_CITY_GET = `${API_SERVER}/checkout/api/city`
export const CHECKOUT_DISTRICT_GET = `${API_SERVER}/checkout/api/district`
export const CHECKOUT_POST = `${API_SERVER}/checkout/api/checkout`
export const CHECKOUT_GET_CART = `${API_SERVER}/checkout/api/cart`
export const CHECKOUT_GET_PROFILE = `${API_SERVER}/checkout/api/
member_profile`
export const COUPON_UPDATE_CART = `${API_SERVER}/checkout/api/update_cart`
// address
export const CHECKOUT_GET_ADDRESS = `${API_SERVER}/checkout/api/member_address`
export const CHECKOUT_DELETE_ADDRESS = `${API_SERVER}/checkout/api/delete_address`
export const CHECKOUT_ADD_ADDRESS = `${API_SERVER}/checkout/api/add_address`
export const CHECKOUT_EDIT_ADDRESS = `${API_SERVER}/checkout/api/edit_address`
export const CHECKOUT_UPDATE_CART = `${API_SERVER}/checkout/api/cart/update`
// reservation
export const GET_RESERVATION_LIST = `${API_SERVER}/reservations`
export const CANCEL_RESERVATION = `${API_SERVER}/reservations/cancel`
export const GET_RESERVATION_PAYMENT = `${API_SERVER}/reservations/result`
// payment
export const ECPAY_GET = `${API_SERVER}/payments`
export const RESERVATION_ECPAY_GET = `${API_SERVER}/payments/reservation`
// coupon
export const GET_MEMBER_COUPON = `${API_SERVER}/coupons`
export const GET_MEMBER_COUPON_IN_CART = `${API_SERVER}/coupons/in_cart`
export const COUPON_ADD = `${API_SERVER}/coupons/add`
export const COUPON_REMOVE = `${API_SERVER}/coupons/remove`
export const COUPON_GET_NEW = `${API_SERVER}/coupons/get-coupon`
export const COUPON_GET_PRODUCT = `${API_SERVER}/coupons/product`
export const COUPON_GET_USE = `${API_SERVER}/coupons/use`
export const COUPON_GET_GENERAL = `${API_SERVER}/coupons/get-coupon`


//teams
export const GET_DATA = `${API_SERVER}/teams/teamSearch`
export const GET_TEAM_DATA = `${API_SERVER}/teams/teamSearch/team`
export const ONE_TEAM = `${API_SERVER}/teams/api/team_info_`
export const RES_TEAM = `${API_SERVER}/teams/api/res_team_`
export const DISPLAY_CHAT = `${API_SERVER}/teams/api/chat/get_chat_at_`
export const ADD_CHAT = `${API_SERVER}/teams/api/chat/add/`
export const GET_ALL_MEMBER = `${API_SERVER}/teams/api/all_member`
export const GET_MEMBER = `${API_SERVER}/teams/api/team_member_at_`
export const GET_USER_DATA = `${API_SERVER}/teams/teamSearch/user/lead_team_`
export const GET_ALL_DATA = `${API_SERVER}/teams/api/all_team`
export const USER_LEAD_TEAM = `${API_SERVER}/teams/api/user_lead_team_`
export const USER_JOIN_TEAM = `${API_SERVER}/teams/api/user_join_team_`
export const MANAGE_MEMBER = `${API_SERVER}/teams/api/manage_member`
export const JOIN_TEAM = `${API_SERVER}/teams/api/team_join/add/`
export const TEAM_START = `${API_SERVER}/teams/api/team_start`
export const R_CREATE_TEAM = `${API_SERVER}/teams/api/create_rid_`
export const CREATE_TEAM = `${API_SERVER}/teams/api/create_team/`

//THEME
export const THEME_LIST = `${API_SERVER}/themes`
export const BRANCH_LIST = `${API_SERVER}/themes/branches`
export const THEME_DETAIL = `${API_SERVER}/themes/`
export const BRANCH_THEMES = `${API_SERVER}/themes/second`
export const THEMES_DETAILS = `${API_SERVER}/themes/details`
export const THEME_IMG = `${API_SERVER}/images`
export const MEMBER_PROFILE = `${API_SERVER}/themes/api/member_profile`
export const CALENDER = `${API_SERVER}/themes/calendar`

const bcrypt = require('bcrypt'); // Băm mật khẩu (1 chiều)

class AuthPass {
    // Xác thực mật khẩu với mật khẩu đã băm
    static async verifyPassword(password, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            console.error('Lỗi khi xác thực mật khẩu:', error);
        }
    }

    // Băm mật khẩu (1 chiều)
    static async hashPassword(password) {
        try {
            const saltRounds = 10; // số vòng băm, càng cao càng bảo mật
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            console.error('Lỗi khi băm mật khẩu:', error);
        }
    }
}

module.exports = AuthPass;

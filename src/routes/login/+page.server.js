import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (locals.session) {
		throw redirect(303, '/');
	}
	return {};
};

export const actions = {
	signUp: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const name = formData.get('name');

		if (!email || !password || !name) {
			return fail(400, { message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email: email.toString(),
					password: password.toString(),
					name: name.toString()
				}
			});
			return { success: true, message: 'สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบได้ทันที' };
		} catch (error) {
			console.error('Sign up error:', error);
			return fail(500, { message: 'ไม่สามารถสมัครสมาชิกได้ อีเมลนี้อาจถูกใช้งานไปแล้ว' });
		}
	},

	signIn: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: email.toString(),
					password: password.toString()
				}
			});
			throw redirect(303, '/');
		} catch (error) {
			if (error.status === 303) throw error;
			console.error('Sign in error:', error);
			return fail(401, { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
		}
	},

	signOut: async ({ request }) => {
		try {
			await auth.api.signOut({
				headers: request.headers
			});
			throw redirect(303, '/login');
		} catch (error) {
			if (error.status === 303) throw error;
			return fail(500, { message: 'เกิดข้อผิดพลาดในการออกจากระบบ' });
		}
	}
};

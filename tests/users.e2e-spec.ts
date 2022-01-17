import { App } from "../src/app";
import { boot } from "../src/main";
import supertest from "supertest";
let application:App;
beforeAll(async(): Promise<void>=>{
	const { app } = await boot;
	application = app;
})
describe('Users e2e', ()=> {
	it('register - error',async():Promise<void> => {
			const res = await supertest(application.app)
				.post('/users/registration')
				.send({email:"a@a.com",password:"123asd"});
			expect(res.statusCode).toBe(422)
	})
	it('register - success',async():Promise<void> => {
		const res = await supertest(application.app)
			.post('/users/registration')
			.send({email:"test1@test.com",password:"123asd",name:"test"});
		expect(res.statusCode).toBe(200)
	})
	it('login - success', async ():Promise<void> => {
		const res = await supertest(application.app)
			.post('/users/login')
			.send({email:"a@a.com",password:"123asd"});
		expect(res.body.jwt).not.toBeUndefined()
	})
	it('login - wrong password', async ():Promise<void> => {
		const res = await supertest(application.app)
			.post('/users/login')
			.send({email:"a@a.com",password:"1"});
		expect(res.statusCode).toBe(401)
	})
	it('info - success', async ():Promise<void> => {
		const login = await supertest(application.app)
			.post('/users/login')
			.send({email:"a@a.com",password:"123asd"});

		const res = await supertest(application.app)
			.get('/users/info')
			.set('Authorization',`Bearer ${login.body.jwt}`)
		expect(res.body.email).toBe('a@a.com')
	})
	it('info - wrong', async ():Promise<void> => {
		const login = await supertest(application.app)
			.post('/users/login')
			.send({email:"a@a.com",password:"123asd"});
		const res = await supertest(application.app)
			.get('/users/info')
			.set('Authorization',`Bearer ${login.body.jwt}123`)
		expect(res.statusCode).toBe(401)
	})
});

afterAll(async(): Promise<void> =>{
	await application.close();
})
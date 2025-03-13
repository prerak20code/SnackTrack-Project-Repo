import { Canteen, Contractor, Student, Snack, Admin } from './Models/index.js';
import bcrypt from 'bcrypt';

export const seedDatabase = async () => {
    try {
        // Clear existing data
        await Canteen.deleteMany();
        await Contractor.deleteMany();
        await Student.deleteMany();
        await Snack.deleteMany();
        await Admin.deleteMany();

        console.log('Existing data cleared');

        // Seed Canteens (Previously, this was under Hostels)
        const canteen1 = await Canteen.create({
            hostelType: 'GH',
            hostelNumber: 8,
            hostelName: 'Flouerence Nightingale',
        });

        const canteen2 = await Canteen.create({
            hostelType: 'BH',
            hostelNumber: 2,
            hostelName: 'Mother Teresa',
        });

        // Seed Contractors
        const password = 'password'; // hashed using pre hook

        await Contractor.create({
            canteenId: canteen1._id,
            fullName: 'John Doe',
            email: 'john@example.com',
            password: password,
            phoneNumber: '1234567890',
        });

        // Seed Students (now referencing `canteenId` instead of `hostelId`)
        await Student.create([
            {
                canteenId: canteen1._id,
                userName: 'GH8-101',
                fullName: 'Alice Smith',
                phoneNumber: '9876543210',
                password: password,
            },
            {
                canteenId: canteen1._id,
                userName: 'GH8-75',
                fullName: 'Bob Johnson',
                phoneNumber: '9876543211',
                password: password,
            },
            {
                canteenId: canteen2._id,
                userName: 'BH2-248',
                fullName: 'Charlie Brown',
                phoneNumber: '9876543212',
                password: password,
            },
            {
                canteenId: canteen2._id,
                userName: 'BH2-3',
                fullName: 'Daisy Miller',
                phoneNumber: '9876543213',
                password: password,
            },
        ]);

        // Seed Snacks (Now directly assigned to Canteens)
        const snacks = await Snack.create([
            {
                canteenId: canteen1._id,
                name: 'Samosa',
                price: 15,
                isAvailable: true,
            },
            {
                canteenId: canteen1._id,
                name: 'Sandwich',
                price: 30,
                isAvailable: true,
            },
            {
                canteenId: canteen1._id,
                name: 'Puff',
                price: 20,
                isAvailable: false,
            },
            {
                canteenId: canteen1._id,
                name: 'Burger',
                price: 40,
                isAvailable: true,
            },
            {
                canteenId: canteen2._id,
                name: 'Paneer Roll',
                price: 50,
                isAvailable: true,
            },
            {
                canteenId: canteen2._id,
                name: 'Vada Pav',
                price: 20,
                isAvailable: false,
            },
        ]);

        // Associate Snacks with their respective canteens
        canteen1.snacks = [snacks[0]._id, snacks[1]._id, snacks[2]._id];
        canteen2.snacks = [snacks[3]._id, snacks[4]._id, snacks[5]._id];
        await canteen1.save();
        await canteen2.save();

        // Seed Admin
        await Admin.create({
            fullName: 'Admin User',
            phoneNumber: '9999999999',
            email: 'admin@example.com',
            password: password,
        });

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

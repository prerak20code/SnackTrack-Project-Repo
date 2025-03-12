import {
    Hostel,
    Canteen,
    Contractor,
    Student,
    Snack,
    Admin,
} from './Models/index.js';
import bcrypt from 'bcrypt';

export const seedDatabase = async () => {
    try {
        await Hostel.deleteMany();
        await Canteen.deleteMany();
        await Contractor.deleteMany();
        await Student.deleteMany();
        await Snack.deleteMany();
        await Admin.deleteMany();

        console.log('Existing data cleared');

        // Seed Hostels
        const hostel1 = await Hostel.create({
            type: 'GH',
            number: 8,
        });
        const hostel2 = await Hostel.create({
            type: 'BH',
            number: 2,
        });

        // Seed Canteens
        const canteen1 = await Canteen.create({ hostelId: hostel1._id });
        const canteen2 = await Canteen.create({ hostelId: hostel2._id });

        // Assign canteen to hostels
        hostel1.canteenId = canteen1._id;
        hostel2.canteenId = canteen2._id;
        await hostel1.save();
        await hostel2.save();

        // Seed Contractors
        const password = 'password';

        await Contractor.create({
            canteenId: canteen1._id,
            fullName: 'John Doe',
            email: 'john@example.com',
            password: password,
            phoneNumber: '1234567890',
        });

        // Seed Students with userName format GH8-75
        await Student.create([
            {
                hostelId: hostel1._id,
                userName: 'GH8-101',
                fullName: 'Alice Smith',
                phoneNumber: '9876543210',
                password: password,
            },
            {
                hostelId: hostel1._id,
                userName: 'GH8-75',
                fullName: 'Bob Johnson',
                phoneNumber: '9876543211',
                password: password,
            },
            {
                hostelId: hostel2._id,
                userName: 'BH2-248',
                fullName: 'Charlie Brown',
                phoneNumber: '9876543212',
                password: password,
            },
            {
                hostelId: hostel2._id,
                userName: 'BH2-3',
                fullName: 'Daisy Miller',
                phoneNumber: '9876543213',
                password: password,
            },
        ]);

        // Seed Snacks (excluding packaged food items like chips and cold drinks)
        await Snack.create([
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
                canteenId: canteen2._id,
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

        // Seed Admin
        await Admin.create({
            fullName: 'Admin User',
            phoneNumber: '9999999999',
            email: 'admin@example.com',
            password: password,
        });

        console.log('Seeding completed');
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

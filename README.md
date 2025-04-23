# Quarantine Virtual Doctor

A comprehensive healthcare management system designed for hospitals and quarantine facilities to manage doctors, nurses, patients, receptionists, and IT managers. The application facilitates patient monitoring, health tracking, room assignments, and communication between healthcare providers.

## Overview

Quarantine Virtual Doctor is a web-based application built to streamline healthcare management during quarantine situations. It provides different interfaces and functionalities for various roles in the healthcare system, including doctors, nurses, receptionists, and IT managers.

## Features

- User Authentication: Secure login system for different user roles (doctors, nurses, receptionists, IT managers)
- Patient Management: Add, edit, view, and delete patient records
- Doctor Management: Manage doctor profiles, specializations, and patient assignments
- Nurse Management: Assign nurses to floors and patients for monitoring
- Room Assignment: Allocate rooms to patients based on availability
- Health Monitoring: Track patient health indicators and vital signs
- Patient Situations: Record and manage patient situations and prescribed medications
- User Management: IT managers can add, edit, and remove system users

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm package manager

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/MohamadJehad/Quarantine-Virtual-Doctor.git
   ```
2. Navigate to the project directory:
   ```
   cd Quarantine-Virtual-Doctor
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
4. Create a .env file in the root directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=quarantine_virtual_doctor
   SESSION_SECRET=your_session_secret
   ```
5. Import the database schema:
   Use the SQL files in the database folder to set up your database schema. Create the required tables for doctors, patients, nurses, etc.
6. Start the application:
   ```
   npm start
   ```

## Project Structure

- server/: Backend code
- config/: Database configuration
- controllers/: Request handlers for different routes
- middleware/: Authentication and other middleware
- models/: Database models for different entities
- routes/: API route definitions
- views/: EJS templates for rendering pages
  - layouts/: Layout templates
  - doctor/: Doctor interface templates
  - nurse/: Nurse interface templates
  - receptionist/: Receptionist interface templates
  - it-manager/: IT manager interface templates
  - patient/: Patient-related templates
  - auth/: Authentication templates
- public/: Static assets

  - styling/: CSS files
  - js/: Client-side JavaScript
  - images/: Image assets

  ## Database Schema

  The application uses a MySQL database with the following main tables:

  - **doctor**: Stores doctor information and credentials
  - **patient**: Contains patient details and room assignments
  - **nurse**: Stores nurse information and floor assignments
  - **receptionist**: Contains receptionist details
  - **IT_Manager**: Stores IT manager information
  - **healthindicator**: Tracks patient health metrics
  - **patient_situation**: Records patient situations and medications
  - **patient_status**: Stores patient health status information
  - **n_monitor_p**: Maps nurse-patient monitoring relationships

  ## Technologies Used

  - **Backend**: Node.js, Express.js
  - **Frontend**: EJS templates, JavaScript, CSS, Bootstrap
  - **Database**: MySQL
  - **Authentication**: Express-session
  - **Other**: Dotenv for environment variables

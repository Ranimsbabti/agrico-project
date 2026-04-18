from werkzeug.security import check_password_hash

hash_value = 'pbkdf2:sha256:600000$ZrCMrYx0IBHWUcFn$1978b25a0cc22af0b05f3dd87d7e2e2b658a6f0cc7008d1105903dd6ca6109dc'

# Try common passwords
common_passwords = [
    'password', '123456', '123456789', 'admin', 'test', 'password123',
    'qwerty', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon',
    'agrico', 'agrico2026', 'fournisseur', 'prestataire', 'agriculteur'
]

for pwd in common_passwords:
    if check_password_hash(hash_value, pwd):
        print(f'Password found: {pwd}')
        break
else:
    print('Password not found in common list. Let me try generating the hash for "password"...')

    from werkzeug.security import generate_password_hash
    test_hash = generate_password_hash('password')
    print(f'Hash for "password": {test_hash}')
    print(f'Does it match? {check_password_hash(hash_value, "password")}')
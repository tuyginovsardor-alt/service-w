# Security Specification

## Data Invariants
1. A user can only create or edit their own profile in `/users/{userId}`.
2. A team member can only create or edit their own resume in `/team/{memberId}` (where `userId` in the document matches `request.auth.uid`).
3. Profiles and Resumes are publicly readable for anyone (investors/users).
4. `isAdmin` field in `/users/{userId}` can only be modified by an existing admin (to be bootstrapped).
5. Timestamps like `createdAt` and `updatedAt` must be server-generated.

## The Dirty Dozen (Attack Vector Payloads)
1. **Identity Spoofing**: User A tries to update User B's profile.
2. **PII Leak**: Unauthenticated user trying to read admin status or private flags (if any).
3. **Ghost Fields**: User tries to add a `verifiedByAdmin` field that doesn't exist in schema.
4. **ID Poisoning**: User tries to use a 1MB string as a document ID.
5. **Timestamp Bypass**: User tries to set `createdAt` manually to 2 years ago.
6. **Privilege Escalation**: Non-admin user tries to set `isAdmin: true` on their profile.
7. **Orphaned Write**: Creating a resume with a `userId` that doesn't match the auth UID.
8. **Resource Exhaustion**: Sending a 1MB string in the `bio` field.
9. **Outcome Locking**: Trying to edit a "finalized" resume if we had a status (not implemented yet, but good for future).
10. **Admin Identity Spoofing**: Trying to use an admin email without verification.
11. **Shadow Update**: Updating `userId` in a resume to point to someone else.
12. **Blanket Query**: Authenticated user trying to crawl the entire `users` collection without specific filters (read rules should enforce this).

## Test Runner (Conceptual)
Tests will be written in `firestore.rules.test.ts` to ensure all above fail with `PERMISSION_DENIED`.

# Comprehensive Mermaid Diagram Examples

## 1. Complex Flowchart with Subgraphs and Styling

```mermaid
flowchart TD
    A[User Login] --> B{Valid Credentials?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Error Page]
    
    subgraph "Authentication System"
        E[JWT Token] --> F[Token Validation]
        F --> G{Token Valid?}
        G -->|Yes| H[Access Granted]
        G -->|No| I[Refresh Token]
        I --> J{Refresh Valid?}
        J -->|Yes| K[New JWT]
        J -->|No| L[Re-login Required]
    end
    
    subgraph "Database Layer"
        M[(User DB)] --> N[Query User]
        O[(Session DB)] --> P[Store Session]
        Q[(Logs DB)] --> R[Audit Trail]
    end
    
    C --> E
    H --> S[API Access]
    S --> T[Data Processing]
    T --> U[Response]
    
    N --> B
    P --> H
    R --> T
    
    classDef authBox fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef dbBox fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef processBox fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    
    class E,F,G,H,I,J,K,L authBox
    class M,N,O,P,Q,R dbBox
    class S,T,U processBox
```

## 2. Sequence Diagram - Full-Stack Application Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API Gateway
    participant AUTH as Auth Service
    participant DB as Database
    participant CACHE as Redis Cache
    participant EMAIL as Email Service
    
    U->>F: Login Request
    F->>API: POST /auth/login
    API->>AUTH: Validate Credentials
    AUTH->>DB: Query User
    DB-->>AUTH: User Data
    
    alt Valid Credentials
        AUTH->>AUTH: Generate JWT
        AUTH->>CACHE: Store Session
        AUTH-->>API: JWT Token
        API-->>F: Success + Token
        F-->>U: Dashboard
        
        Note over U,EMAIL: User Actions
        U->>F: Request Data
        F->>API: GET /data (with JWT)
        API->>AUTH: Validate Token
        AUTH->>CACHE: Check Session
        CACHE-->>AUTH: Session Valid
        AUTH-->>API: Authorized
        API->>DB: Fetch Data
        DB-->>API: Data Response
        API-->>F: JSON Data
        F-->>U: Display Data
        
    else Invalid Credentials
        AUTH-->>API: Error
        API-->>F: 401 Unauthorized
        F-->>U: Error Message
        
        Note over U,EMAIL: Password Reset Flow
        U->>F: Reset Password
        F->>API: POST /auth/reset
        API->>AUTH: Generate Reset Token
        AUTH->>DB: Store Reset Token
        AUTH->>EMAIL: Send Reset Email
        EMAIL-->>U: Reset Link
    end
```

## 3. Class Diagram - E-commerce System

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string password
        +string firstName
        +string lastName
        +Date createdAt
        +login()
        +logout()
        +updateProfile()
    }
    
    class Customer {
        +string shippingAddress
        +string billingAddress
        +placeOrder()
        +viewOrderHistory()
    }
    
    class Admin {
        +string permissions
        +manageProducts()
        +viewAnalytics()
        +manageUsers()
    }
    
    class Product {
        +int id
        +string name
        +string description
        +decimal price
        +int stock
        +string category
        +updateStock()
        +setPrice()
    }
    
    class Order {
        +int id
        +Date orderDate
        +decimal totalAmount
        +string status
        +calculateTotal()
        +updateStatus()
    }
    
    class OrderItem {
        +int quantity
        +decimal unitPrice
        +decimal subtotal
        +calculateSubtotal()
    }
    
    class Cart {
        +int id
        +Date createdAt
        +addItem()
        +removeItem()
        +clearCart()
        +getTotal()
    }
    
    class Payment {
        +int id
        +decimal amount
        +string method
        +string status
        +Date processedAt
        +processPayment()
        +refund()
    }
    
    User <|-- Customer
    User <|-- Admin
    Customer ||--o{ Order : places
    Order ||--o{ OrderItem : contains
    Product ||--o{ OrderItem : included_in
    Customer ||--|| Cart : has
    Cart ||--o{ Product : contains
    Order ||--|| Payment : has_payment
```

## 4. State Diagram - Order Processing

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Processing : Payment Confirmed
    Pending --> Cancelled : Payment Failed
    
    Processing --> Shipped : Items Packaged
    Processing --> Cancelled : Out of Stock
    
    Shipped --> InTransit : Carrier Pickup
    InTransit --> Delivered : Customer Received
    InTransit --> Lost : Tracking Lost
    
    Delivered --> Completed : No Issues
    Delivered --> Returned : Customer Return
    
    Returned --> Refunded : Return Processed
    Returned --> Exchanged : Exchange Requested
    
    Lost --> Refunded : Insurance Claim
    Cancelled --> Refunded : Refund Processed
    
    Completed --> [*]
    Refunded --> [*]
    Exchanged --> Processing
```

## 5. Gantt Chart - Project Timeline

```mermaid
gantt
    title Full-Stack Development Project
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements Analysis    :done, req, 2024-01-01, 2024-01-15
    System Design          :done, design, 2024-01-10, 2024-01-25
    Database Design        :done, db-design, 2024-01-20, 2024-02-05
    
    section Backend
    API Development        :active, api, 2024-02-01, 2024-03-15
    Authentication System  :auth, 2024-02-15, 2024-03-01
    Database Integration   :db-int, 2024-03-01, 2024-03-20
    Testing               :testing, 2024-03-15, 2024-04-01
    
    section Frontend
    UI/UX Design          :ui, 2024-02-01, 2024-02-20
    React Development     :react, 2024-02-20, 2024-04-01
    Integration Testing   :integration, 2024-04-01, 2024-04-15
    
    section Deployment
    CI/CD Setup           :cicd, 2024-04-10, 2024-04-20
    Production Deployment :deploy, 2024-04-20, 2024-04-25
    Monitoring Setup      :monitor, 2024-04-25, 2024-04-30
```

## 6. ER Diagram - Database Schema

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string password
        string first_name
        string last_name
        datetime created_at
        datetime updated_at
    }
    
    CUSTOMER {
        int user_id PK,FK
        string shipping_address
        string billing_address
        string phone
    }
    
    ADMIN {
        int user_id PK,FK
        json permissions
        string department
    }
    
    PRODUCT {
        int id PK
        string name
        text description
        decimal price
        int stock_quantity
        int category_id FK
        datetime created_at
    }
    
    CATEGORY {
        int id PK
        string name
        string description
        int parent_id FK
    }
    
    ORDER {
        int id PK
        int customer_id FK
        decimal total_amount
        string status
        datetime order_date
        datetime shipped_date
    }
    
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }
    
    CART {
        int id PK
        int customer_id FK
        datetime created_at
        datetime updated_at
    }
    
    CART_ITEM {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
        datetime added_at
    }
    
    PAYMENT {
        int id PK
        int order_id FK
        decimal amount
        string payment_method
        string transaction_id
        string status
        datetime processed_at
    }
    
    USER ||--o| CUSTOMER : is
    USER ||--o| ADMIN : is
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : included_in
    PRODUCT }o--|| CATEGORY : belongs_to
    CATEGORY ||--o{ CATEGORY : has_subcategory
    CUSTOMER ||--|| CART : has
    CART ||--o{ CART_ITEM : contains
    PRODUCT ||--o{ CART_ITEM : added_to
    ORDER ||--|| PAYMENT : has_payment
```

## 7. Journey Map - User Experience

```mermaid
journey
    title Customer Shopping Journey
    section Discovery
      Visit Website           : 5: Customer
      Browse Categories       : 4: Customer
      Search Products         : 4: Customer
      View Product Details    : 5: Customer
    section Evaluation
      Compare Products        : 3: Customer
      Read Reviews           : 4: Customer
      Check Availability     : 5: Customer
      Add to Cart            : 5: Customer
    section Purchase
      Review Cart            : 4: Customer
      Enter Shipping Info    : 3: Customer
      Select Payment Method  : 3: Customer
      Complete Payment       : 2: Customer
      Receive Confirmation   : 5: Customer
    section Fulfillment
      Order Processing       : 3: Customer, Admin
      Shipping Notification  : 4: Customer
      Track Package          : 4: Customer
      Receive Product        : 5: Customer
    section Post-Purchase
      Product Review         : 4: Customer
      Customer Support       : 3: Customer, Support
      Repeat Purchase        : 5: Customer
```

## 8. Git Flow Diagram

```mermaid
gitgraph
    commit id: "Initial commit"
    branch develop
    checkout develop
    commit id: "Setup project structure"
    
    branch feature/authentication
    checkout feature/authentication
    commit id: "Add login component"
    commit id: "Add JWT handling"
    commit id: "Add logout functionality"
    
    checkout develop
    merge feature/authentication
    commit id: "Merge auth feature"
    
    branch feature/product-catalog
    checkout feature/product-catalog
    commit id: "Add product listing"
    commit id: "Add product search"
    
    checkout develop
    branch hotfix/security-patch
    checkout hotfix/security-patch
    commit id: "Fix security vulnerability"
    
    checkout main
    merge hotfix/security-patch
    tag: "v1.0.1"
    
    checkout develop
    merge hotfix/security-patch
    merge feature/product-catalog
    
    branch release/v1.1.0
    checkout release/v1.1.0
    commit id: "Version bump"
    commit id: "Update documentation"
    
    checkout main
    merge release/v1.1.0
    tag: "v1.1.0"
    
    checkout develop
    merge release/v1.1.0
```
```

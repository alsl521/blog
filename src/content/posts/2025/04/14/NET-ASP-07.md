---
title: "ASP.NET学习记录-07-代码组织和依赖注入"
published: 2025-04-14T19:25:07+08:00
description: "C# .NET ASP.NET Core 基础入门 简单学习"
tags: ["C#", "ASP"]
category: "C#/.NET"
draft: false
pinned: false
author: "alsl521"
lang: "zh_CN"
comment: false
---
# 1、代码组织

在 ASP.NET 中，“代码组织”指的是如何**结构化代码**，以提高可维护性、可读性和可扩展性。这涉及多个方面，包括项目结构、分层架构、模块化设计和最佳实践。

1. **项目结构**

在 ASP.NET Core 中，一个典型的项目组织方式如下：

```cmd
/MyApp
 ├── Controllers/      // 处理 HTTP 请求的控制器
 ├── Models/           // 数据模型
 ├── Views/            // Razor 视图（如果使用 MVC）
 ├── Services/         // 业务逻辑层
 ├── Middleware/       // 自定义中间件
 ├── Data/             // 数据访问层（EF Core、存储库等）
 ├── wwwroot/          // 静态文件（CSS、JS、Images）
 ├── Program.cs        // 应用程序启动入口
 ├── appsettings.json  // 应用程序配置
```

这种组织方式确保了**职责分离**，使得代码更易管理。

2. **分层架构**

ASP.NET 应用通常采用分层架构，以实现清晰的代码结构：

- **表现层（Controllers, Views）**：负责接收用户请求并呈现数据。
- **业务逻辑层（Services）**：处理应用核心逻辑，如验证、计算等。
- **数据访问层（Repositories, Data）**：与数据库交互，封装数据操作。

分层架构的好处： ✅ 提高代码的**可维护性** ✅ 便于单独测试每一层 ✅ 支持不同的数据存储（SQL、NoSQL）

3. **模块化设计**

**模块化**意味着将功能拆分为独立的组件，比如：

- **中间件（Middleware）**：封装 HTTP 请求处理，如身份验证、日志记录等。
- **依赖注入（Dependency Injection）**：通过 `IServiceCollection` 进行依赖管理，减少耦合。
- **自定义服务（Custom Services）**：比如创建 `IMailService` 处理邮件发送。

4. **最佳实践**

- **使用 `SOLID` 原则**（单一职责、开闭原则等）
- **遵循 `MVC` 设计模式**
- **使用 `Minimal API` 进行轻量级开发**
- **避免过度耦合，提倡松耦合架构**

**总结**： ASP.NET 的代码组织涉及**文件结构、分层架构、模块化设计和最佳实践**，这些策略能让项目更易维护、更具可扩展性，同时提高开发效率。

Program.cs

```C#
// 引入必要的命名空间
using System.Text.Json;          // JSON序列化/反序列化
using WebApi.Endpoints;          // 自定义端点定义
using WebApi.Models;             // 数据模型
using WebApi.Results;            // API返回结果处理

// 创建Web应用构建器
var builder = WebApplication.CreateBuilder(args);

// 添加问题详情服务(用于错误处理)
builder.Services.AddProblemDetails();

// 构建应用程序
var app = builder.Build();

// 非开发环境配置异常处理中间件
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}

// 使用状态码页面中间件
app.UseStatusCodePages();

// 映射员工相关端点
app.MapEmployeeEndpoints();

// 启动应用程序
app.Run();
```

EmployeeEndpoints.cs

```C#
using WebApi.Models;          // 引入员工数据模型
using WebApi.Results;        // 引入自定义返回结果类型

namespace WebApi.Endpoints
{
    // 员工相关端点定义静态类
    public static class EmployeeEndpoints
    {
        // 映射所有员工相关端点的扩展方法
        public static void MapEmployeeEndpoints(this WebApplication app)
        {
            // 根路径GET端点 - 返回欢迎页面HTML
            app.MapGet("/", HtmlResult () =>
            {
                string html = "<h2>Welcome to our API</h2> Our API is used to learn ASP.NET CORE.";
                return new HtmlResult(html);  // 使用自定义HtmlResult返回HTML内容
            });

            // GET /employees - 获取所有员工列表
            app.MapGet("/employees", () =>
            {
                var employees = EmployeesRepository.GetEmployees();  // 从仓库获取员工数据
                return TypedResults.Ok(employees);  // 返回200 OK响应和员工数据
            });

            // GET /employees/{id} - 根据ID获取单个员工
            app.MapGet("/employees/{id:int}", (int id) =>
            {
                var employee = EmployeesRepository.GetEmployeeById(id);  // 根据ID查询员工
                return employee is not null
                    ? TypedResults.Ok(employee)  // 找到则返回200 OK
                    : Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>  // 未找到返回404错误
                    {
                        {"id", new[] { $"Employee with the id {id} doesn't exist." } }
                    },
                    statusCode: 404);
            });

            // POST /employees - 创建新员工
            app.MapPost("/employees", (Employee employee) =>
            {
                // 验证员工数据有效性
                if (employee is null || employee.Id < 0)
                {
                    return Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>
                    {
                        {"id", new[] { "Employee is not provided or is not valid." } }
                    },
                    statusCode: 400);  // 无效数据返回400错误
                }

                EmployeesRepository.AddEmployee(employee);  // 添加新员工到仓库
                return TypedResults.Created($"/employees/{employee.Id}", employee);  // 返回201 Created响应

            }).WithParameterValidation();  // 启用参数自动验证

            // PUT /employees/{id} - 更新员工信息
            app.MapPut("/employees/{id:int}", (int id, Employee employee) =>
            {
                // 验证ID一致性
                if (id != employee.Id)
                {
                    return Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>
                    {
                        {"id", new[] { "Employee id is not the same as id." } }
                    },
                    statusCode: 400);
                }

                return EmployeesRepository.UpdateEmployee(employee)  // 尝试更新员工
                    ? TypedResults.NoContent()  // 成功返回204 No Content
                    : Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>  // 失败返回404
                    {
                        {"id", new[] { "Employee doesn't exist." } }
                    },
                    statusCode: 404);
            });

            // DELETE /employees/{id} - 删除员工
            app.MapDelete("/employees/{id:int}", (int id) =>
            {
                var employee = EmployeesRepository.GetEmployeeById(id);  // 根据ID获取员工

                return EmployeesRepository.DeleteEmployee(employee)  // 尝试删除员工
                    ? TypedResults.Ok(employee)  // 成功返回200 OK和被删除员工
                    : Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>  // 失败返回404
                    {
                        {"id", new[] { $"Employee with the id {id} doesn't exist." } }
                    },
                    statusCode: 404);
            });
        }
    }
}
```

# 2、依赖问题

在 ASP.NET（尤其是 ASP.NET Core）中，**“Dependency Problem”（依赖问题）**通常指的是由于组件、服务或模块之间的依赖关系管理不当，导致系统出现耦合过高、维护困难或运行时错误等问题。

1. **常见的依赖问题**

依赖问题可能有多种表现形式，以下是一些常见情况：

- **紧耦合（Tight Coupling）**
  - 组件或类直接依赖具体实现，而不是依赖抽象（接口）。
  - 使得代码难以扩展或替换，影响可测试性。
- **循环依赖（Circular Dependency）**
  - 两个或多个类相互依赖，导致无法正确解析依赖项。
  - 例如：`A` 依赖 `B`，而 `B` 又依赖 `A`，导致对象初始化困难。
- **服务解析失败（Service Resolution Failure）**
  - 在依赖注入（DI）系统中，某个服务没有正确注册，导致运行时 `InvalidOperationException`。
- **错误的作用域（Scope Issue）**
  - 在 ASP.NET Core 的 DI 体系中，`Transient`、`Scoped` 和 `Singleton` 服务作用域如果使用不当，可能会导致意外的行为，例如：
    - `Scoped` 服务注入到 `Singleton` 服务中，导致生命周期不匹配。
    - `Transient` 服务在短时间内频繁创建，影响性能。

2. **如何解决依赖问题**

ASP.NET Core 采用**依赖注入（Dependency Injection，DI）**来管理依赖关系，可以有效减少耦合和提高可维护性。
 一些优化方法包括：

- **使用接口（Interface）代替具体实现**：
  - 例如：`IMyService` 代替 `MyService`，避免直接依赖具体实现，使代码更具灵活性。
- **正确注册服务**：
  - 在 `Program.cs` 中，通过 `services.AddTransient()` 或 `services.AddScoped()` 来正确注册依赖项。
- **避免循环依赖**：
  - 使用**事件驱动**或**Mediator 模式**解耦循环引用的组件。
- **合理使用依赖作用域**：
  - `Transient`（每次请求创建新实例）
  - `Scoped`（在请求范围内共享实例）
  - `Singleton`（整个应用生命周期共享实例）

**总结**

在 ASP.NET Core 中，依赖问题通常与**耦合、循环引用、DI 解析失败或作用域错误**相关。通过合理使用**依赖注入（DI）**、**接口代替具体实现**以及**优化服务注册**，可以有效减少这些问题，让应用更加健壮且易于维护。

# 3、依赖反转

**Dependency Inversion Principle（依赖反转原则，DIP）** 是 **SOLID** 设计原则之一，旨在降低代码耦合，提高可维护性和扩展性。在 ASP.NET（尤其是 ASP.NET Core）中，DIP 主要体现在**依赖注入（Dependency Injection, DI）**的使用。

**1. 什么是依赖反转原则？**

DIP 由两部分组成：

1. **高层模块（High-level Modules）不应该依赖低层模块（Low-level Modules），两者都应该依赖于抽象（Abstraction）。**
2. **抽象（Abstraction）不应该依赖具体实现（Concrete Implementation），具体实现应该依赖抽象。**

简单来说，DIP 让代码更加松耦合，使得高层业务逻辑不会直接绑定到低层细节，从而提高灵活性和可测试性。

**2. 在 ASP.NET Core 中如何应用 DIP？**

ASP.NET Core 通过 **依赖注入（DI）** 来实现 DIP。示例如下：

**(1) 不遵循 DIP（紧耦合代码）**

```C#
public class OrderService
{
    private readonly EmailService _emailService;

    public OrderService()
    {
        _emailService = new EmailService(); // 直接依赖具体实现
    }

    public void ProcessOrder()
    {
        _emailService.SendEmail("Order processed.");
    }
}
```

这里 `OrderService` 直接创建了 `EmailService`，导致两个类**紧密耦合**，如果要替换 `EmailService`，必须修改 `OrderService` 的代码。

**(2) 遵循 DIP（使用抽象和 DI）**

```C#
public interface IEmailService
{
    void SendEmail(string message);
}

public class EmailService : IEmailService
{
    public void SendEmail(string message)
    {
        Console.WriteLine($"Email sent: {message}");
    }
}

public class OrderService
{
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService) // 依赖抽象
    {
        _emailService = emailService;
    }

    public void ProcessOrder()
    {
        _emailService.SendEmail("Order processed.");
    }
}
```

✅ **高层模块 `OrderService` 只依赖 `IEmailService`（抽象）**，而不是 `EmailService`（具体实现）。

✅ `IEmailService` 可以有多个实现，如 `MockEmailService`（用于测试）或 `SmsService`（发送短信），但不影响 `OrderService` 的代码。

在 ASP.NET Core 中，可以在 `Program.cs` 里配置 **依赖注入**：

`builder.Services.AddTransient();`

框架会自动提供正确的实现，符合 DIP 规则。

**3. DIP 好处**

✅ **降低耦合**：高层代码不直接依赖底层具体实现。
✅ **更易测试**：可以使用 `Mock` 替换依赖，进行单元测试。
✅ **增强扩展性**：可以随时切换不同的实现，而不影响业务逻辑。

**总结**

在 ASP.NET Core 中，**依赖反转原则** 通过 **依赖注入（DI）** 来实现，确保高层模块依赖于抽象，而不是具体实现。这种设计方式提升了代码的可维护性、可测试性和扩展性。

Employee.cs

```C#
using System.ComponentModel.DataAnnotations;  // 引入数据验证特性

namespace WebApi.Models
{
    // 员工数据模型类
    public class Employee
    {
        // 员工ID属性
        public int Id { get; set; }

        // 员工姓名属性
        public string Name { get; set; }

        // 员工职位属性（必填字段）
        [Required]
        public string Position { get; set; }

        // 员工薪资属性
        public double Salary { get; set; }

        // 构造函数：初始化员工对象
        public Employee(int id, string name, string position, double salary)
        {
            Id = id;          // 设置员工ID
            Name = name;      // 设置员工姓名
            Position = position;  // 设置员工职位
            Salary = salary;  // 设置员工薪资
        }
    }
}
```

EmployeesRepository.cs

```C#
namespace WebApi.Models
{
    // 员工数据仓库类（非静态实现）
    public class EmployeesRepository
    {
        // 员工列表字段（非静态）
        private List<Employee> employees = new List<Employee>
        {
            new Employee(1, "John Doe", "Engineer", 60000),  // 初始化示例员工1
            new Employee(2, "Jane Smith", "Manager", 75000), // 初始化示例员工2
            new Employee(3, "Sam Brown", "Technician", 50000) // 初始化示例员工3
        };

        // 获取所有员工列表
        public List<Employee> GetEmployees() => employees;

        // 根据ID查询单个员工
        public Employee? GetEmployeeById(int id)
        {
            // 使用LINQ查询匹配指定ID的员工
            return employees.FirstOrDefault(x => x.Id == id);
        }

        // 添加新员工
        public void AddEmployee(Employee? employee)
        {
            // 验证员工对象有效性
            if (employee is not null)
            {
                // 自动生成新ID（当前最大ID+1）
                int maxId = employees.Max(x => x.Id);
                employee.Id = maxId + 1;
                // 将新员工添加到列表
                employees.Add(employee);
            }
        }

        // 更新员工信息
        public bool UpdateEmployee(Employee? employee)
        {
            // 验证员工对象有效性
            if (employee is not null)
            {
                // 查找要更新的员工记录
                var emp = employees.FirstOrDefault(x => x.Id == employee.Id);
                if (emp is not null)
                {
                    // 更新员工详细信息
                    emp.Name = employee.Name;
                    emp.Position = employee.Position;
                    emp.Salary = employee.Salary;

                    return true;  // 返回更新成功状态
                }
            }

            return false;  // 返回更新失败状态
        }

        // 删除员工
        public bool DeleteEmployee(Employee? employee)
        {
            // 验证员工对象有效性
            if (employee is not null)
            {
                // 从列表中移除指定员工
                employees.Remove(employee);
                return true;  // 返回删除成功状态
            }

            return false;  // 返回删除失败状态
        }
    }
}
```

IEmployeesRepository.cs

```C#
namespace WebApi.Models
{
    // 员工数据仓库接口定义
    public interface IEmployeesRepository
    {
        // 添加新员工方法
        void AddEmployee(Employee? employee);

        // 删除员工方法
        bool DeleteEmployee(Employee? employee);

        // 根据ID获取单个员工方法
        Employee? GetEmployeeById(int id);

        // 获取所有员工列表方法
        List<Employee> GetEmployees();

        // 更新员工信息方法
        bool UpdateEmployee(Employee? employee);
    }
}
```

# 4、控制反转

在 ASP.NET 中，**Inversion of Control (IoC) Principle**（控制反转原则）是一种设计原则，用于提高代码的灵活性和可维护性。它强调通过将对象创建和依赖管理的责任“反转”到框架或容器中，而不是在类内部直接管理这些依赖。

核心理念

控制反转原则的核心思想是让高层模块不直接控制低层模块的创建或依赖注入，而是通过框架或第三方工具来管理这些依赖。这种反转确保了代码更松耦合，并且便于进行扩展和测试。

**ASP.NET 中 IoC 的应用**

在 ASP.NET Core 中，IoC 主要通过**依赖注入（Dependency Injection, DI）**来实现。框架提供了一个内置的 IoC 容器，用于管理服务的注册和解析。这是 IoC 最典型的应用场景。

**1. 传统方式（未使用 IoC）**

如果没有 IoC，类通常会自行创建其依赖项：

```C#
public class OrderService
{
    private readonly EmailService _emailService;

    public OrderService()
    {
        _emailService = new EmailService(); // 自己创建依赖项
    }

    public void ProcessOrder()
    {
        _emailService.SendEmail("Order processed.");
    }
}
```

这种方式将 `EmailService` 的创建硬编码到 `OrderService` 中，导致了**紧耦合**，不利于测试和扩展。

**2. 使用 IoC 容器（控制反转）**

通过 IoC 原则，依赖项的创建交由 IoC 容器负责，而不是类自身控制：

```C#
public class OrderService
{
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService) // 依赖项通过注入提供
    {
        _emailService = emailService;
    }

    public void ProcessOrder()
    {
        _emailService.SendEmail("Order processed.");
    }
}
```

在 ASP.NET Core 中，可以在 `Program.cs` 中注册服务：

```C#
builder.Services.AddTransient();
```

当 `OrderService` 被解析时，IoC 容器会自动提供一个 `IEmailService` 的实例，而不是 `OrderService` 自行创建依赖。

**IoC 的优点**

1. **降低耦合**：通过依赖注入解耦类之间的关系，使代码更易维护。
2. **易于测试**：可以用 Mock 替代实际实现，进行单元测试。
3. **提高扩展性**：可以方便地替换或添加新的实现，而不会影响代码逻辑。
4. **支持更复杂的设计模式**：例如 `Factory`、`Service Locator` 等。

**总结**

控制反转原则（IoC）通过将依赖管理的责任交给容器，而不是在类内部直接控制对象创建和依赖关系，在 ASP.NET 中主要通过**依赖注入**机制体现。它是一种现代软件开发中非常重要的设计模式，有助于创建松耦合、易扩展和可测试的系统。

EmployeeEndpoints.cs

```C#
using WebApi.Models;          // 引入员工数据模型
using WebApi.Results;        // 引入自定义返回结果类型

namespace WebApi.Endpoints
{
    // 员工相关API端点配置类
    public static class EmployeeEndpoints
    {
        // 配置员工相关API路由的扩展方法
        public static void MapEmployeeEndpoints(this WebApplication app)
        {
            // 根路径GET请求 - 返回欢迎页面
            app.MapGet("/", HtmlResult () =>
            {
                string html = "<h2>Welcome to our API</h2> Our API is used to learn ASP.NET CORE.";
                return new HtmlResult(html);  // 返回HTML格式的欢迎页面
            });

            // GET /employees - 获取所有员工
            app.MapGet("/employees", (IEmployeesRepository employeesRepository) =>
            {
                var employees = employeesRepository.GetEmployees();  // 从仓储获取员工列表
                return TypedResults.Ok(employees);  // 返回200状态码和员工数据
            });

            // GET /employees/{id} - 获取单个员工详情
            app.MapGet("/employees/{id:int}", (int id, IEmployeesRepository employeesRepository) =>
            {
                var employee = employeesRepository.GetEmployeeById(id);  // 根据ID查询员工
                return employee is not null
                    ? TypedResults.Ok(employee)  // 找到则返回200和员工数据
                    : Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>  // 未找到返回404错误
                    {
                        {"id", new[] { $"找不到ID为{id}的员工" } }
                    },
                    statusCode: 404);
            });

            // POST /employees - 创建新员工
            app.MapPost("/employees", (Employee employee, IEmployeesRepository employeesRepository) =>
            {
                // 验证员工数据有效性
                if (employee is null || employee.Id < 0)
                {
                    return Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>
                    {
                        {"id", new[] { "员工数据无效或未提供" } }
                    },
                    statusCode: 400);  // 无效数据返回400错误
                }

                employeesRepository.AddEmployee(employee);  // 添加新员工
                return TypedResults.Created($"/employees/{employee.Id}", employee);  // 返回201创建成功响应

            }).WithParameterValidation();  // 启用参数自动验证

            // PUT /employees/{id} - 更新员工信息
            app.MapPut("/employees/{id:int}", (int id, Employee employee, IEmployeesRepository employeesRepository) =>
            {
                // 验证ID一致性
                if (id != employee.Id)
                {
                    return Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>
                    {
                        {"id", new[] { "员工ID不匹配" } }
                    },
                    statusCode: 400);
                }

                return employeesRepository.UpdateEmployee(employee)  // 尝试更新员工
                    ? TypedResults.NoContent()  // 成功返回204无内容
                    : Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>  // 失败返回404
                    {
                        {"id", new[] { "员工不存在" } }
                    },
                    statusCode: 404);
            });

            // DELETE /employees/{id} - 删除员工
            app.MapDelete("/employees/{id:int}", (int id, IEmployeesRepository employeesRepository) =>
            {
                var employee = employeesRepository.GetEmployeeById(id);  // 查询要删除的员工

                return employeesRepository.DeleteEmployee(employee)  // 尝试删除
                    ? TypedResults.Ok(employee)  // 成功返回200和被删除员工
                    : Microsoft.AspNetCore.Http.Results.ValidationProblem(new Dictionary<string, string[]>  // 失败返回404
                    {
                        {"id", new[] { $"找不到ID为{id}的员工" } }
                    },
                    statusCode: 404);
            });
        }
    }
}
```

Program.cs

```C#
// 引入必要的命名空间
using System.Text.Json;          // 用于JSON数据的序列化和反序列化操作
using WebApi.Endpoints;          // 引入自定义的API端点定义
using WebApi.Models;             // 引入数据模型定义
using WebApi.Results;            // 引入API返回结果处理相关类

// 创建Web应用构建器实例
var builder = WebApplication.CreateBuilder(args);

// 添加问题详情服务(用于更详细的错误信息处理)
builder.Services.AddProblemDetails();

// 注册员工数据仓库服务(使用瞬态生命周期)
builder.Services.AddTransient<IEmployeesRepository, EmployeesRepository>();

// 构建Web应用程序实例
var app = builder.Build();

// 非开发环境配置异常处理中间件
if (!app.Environment.IsDevelopment())
{
    // 使用默认的异常处理中间件
    app.UseExceptionHandler();
}

// 使用状态码页面中间件(自动处理HTTP错误状态码)
app.UseStatusCodePages();

// 映射员工相关的API端点路由
app.MapEmployeeEndpoints();

// 启动并运行Web应用程序
app.Run();
```

# 5、生命周期管理

在 ASP.NET Core 的 **Minimal APIs** 中，“Lifetime Management”（生命周期管理）主要指的是如何管理服务实例的**创建、作用域和释放**，以确保它们在应用运行期间以高效和正确的方式工作。生命周期管理是依赖注入（Dependency Injection, DI）机制的重要组成部分，在 Minimal APIs 中同样适用。

**1. 依赖注入中的服务生命周期**

ASP.NET Core 使用 **IoC（控制反转）容器** 来管理服务的生命周期。在 Minimal APIs 中，可以通过 `Program.cs` 注册服务并指定它们的生命周期。

服务生命周期有以下三种类型：

- **Transient**
   每次请求都会创建一个新的服务实例。适用于轻量服务或不需要共享状态的服务。

  ```C#
  builder.Services.AddTransient();
  ```

- **Scoped**
   在同一 HTTP 请求的范围内共享一个服务实例。适用于需要在请求内保持一致性，但不需要跨请求共享的服务。

  ```C#
  builder.Services.AddScoped();
  ```

- **Singleton**
   在应用程序整个生命周期内只创建一个服务实例。适用于共享数据或耗资源较多的服务。

  ```C#
  builder.Services.AddSingleton();
  ```

**2. Minimal APIs 中的服务注入与生命周期管理**

在 Minimal APIs 中，可以轻松地在终结点中注入服务，并根据服务的生命周期使用它们。例如：

```C#
app.MapGet("/example", (IMyService service) => service.DoWork());
```

上述代码依赖框架的 DI 容器来自动管理 `IMyService` 的实例。

**示例：Scoped 服务的生命周期**

如果你在一个请求中调用多个终结点或服务，它们将共享同一个 `Scoped` 服务实例：

```C#
builder.Services.AddScoped<IMyService, MyService>();
app.MapGet("/process1", (IMyService service) => service.DoWork());
app.MapGet("/process2", (IMyService service) => service.DoWork());
```

在同一个 HTTP 请求中，两次调用 `IMyService` 都会使用相同的实例。

**3. 生命周期管理的最佳实践**

- **选择正确的服务生命周期**：
  - 如果服务依赖于短时间的操作或无需跨请求共享状态，使用 **Transient**。
  - 如果服务需要在单个请求内共享数据，选择 **Scoped**。
  - 如果服务需要跨请求共享状态或耗资源较多，选择 **Singleton**。
- **避免生命周期冲突**： 不要注入生命周期较短的服务（如 Scoped 或 Transient）到生命周期较长的服务（如 Singleton），否则可能导致状态不一致或运行时错误。
- **释放资源**： 容器会自动释放实现了 `IDisposable` 的服务实例，但确保正确地释放外部资源，例如数据库连接或文件句柄。

**4. 总结**

在 ASP.NET Core Minimal APIs 中，“Lifetime Management” 是通过 DI 容器控制服务实例的创建和释放的机制。它帮助开发者选择适当的服务生命周期，确保资源高效利用，同时避免不必要的状态共享和冲突。

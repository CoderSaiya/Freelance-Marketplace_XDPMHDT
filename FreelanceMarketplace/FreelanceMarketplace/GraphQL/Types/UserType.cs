﻿using FreelanceMarketplace.Models;
using GraphQL.Types;

namespace FreelanceMarketplace.GraphQL.Types
{
    public class UserType : ObjectGraphType<Users>
    {
        public UserType()
        {
            Field(x => x.Id);
            Field(x => x.Username);
            Field(x => x.PasswordHash);
            Field(x => x.Email);
            Field(x => x.Role);
            Field(x => x.IsEmailConfirmed);
            Field(x => x.CreateAt);
            Field<ListGraphType<ProjectType>>("projects");
            Field<ListGraphType<RefreshTokenType>>("refreshTokens");
            Field<UserProfileType>("userProfile");
            Field<ListGraphType<ProjectType>>("uploadedImages");
        }
    }
}

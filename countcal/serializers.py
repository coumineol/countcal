from django.contrib.auth.models import User, Group
from rest_framework import serializers
from toptalproject.countcal.models import Meal


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ('id', 'name')


class UserSerializer(serializers.ModelSerializer):

    meal_set = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'groups', 'meal_set')
        extra_kwargs = {'password': {'write_only': True}, }

    def create(self, validated_data):
        """
        user = User.objects.create(
            username=validated_data['username'],
            groups=validated_data['groups'],
        )
        user.set_password(validated_data['password'])
        user = User.objects.create_user(**validated_data)
        return user
        """
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        for item in validated_data['groups']:
            user.groups.add(Group.objects.get(name=item))
        return user


class MealSerializer(serializers.ModelSerializer):

    # user = UserSerializer()

    class Meta:
        model = Meal
        fields = ('id', 'user', 'cal', 'date', 'comment')
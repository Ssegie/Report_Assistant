from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('reports', 'previous_migration_name'),  # replace with your last migration
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='file',
            field=models.FileField(upload_to='reports/', null=True, blank=True),
        ),
    ]
